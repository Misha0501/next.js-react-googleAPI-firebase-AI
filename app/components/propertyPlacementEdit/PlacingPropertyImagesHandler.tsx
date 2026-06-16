import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import Image from "next/image";
import { ListingImage } from "@/types";
import { useDeleteListingImage } from "@/providers/ListingImages";
import { uniqueID } from "@/app/lib/uniqueID";
import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type PlacingPropertyImagesHandlerProps = {
  onChange: (images: ListingImage[]) => void;
  initialImages?: ListingImage[];
};

export const PlacingPropertyImagesHandler = ({
  onChange,
  initialImages,
}: PlacingPropertyImagesHandlerProps) => {
  const { user, authToken } = useAuthContext();
  const [images, setImages] = useState<ListingImage[]>(initialImages || []);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const deleteListingImage = useDeleteListingImage({ authToken });

  useEffect(() => {
    setImages(initialImages || []);
  }, [initialImages]);

  const handleFileInputClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    hiddenFileInput.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const uid = user?.uid;

    if (!files.length) {
      setError("Please select at least one image");
      return;
    }

    if (!uid) {
      setError("Please sign in again before uploading images");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const storage = getStorage();
      const uploadedImages: Omit<ListingImage, "positionInListing">[] = [];

      for (const file of files) {
        const fileName = file.name.replace(/\.[^/.]+$/, ".jpg");
        const imagePath = `publicImages/${uniqueID()}-${fileName}`;
        const imageRef = ref(storage, imagePath);

        await uploadBytes(imageRef, file, {
          customMetadata: {
            firebaseUID: uid,
            activity: "Property placement",
          },
        });

        const downloadURL = await getDownloadURL(imageRef);
        uploadedImages.push({
          url: downloadURL,
          imagePath,
        });
      }

      setImages((prevState) => {
        const nextImages = [
          ...prevState,
          ...uploadedImages.map((image, index) => ({
            ...image,
            positionInListing: prevState.length + index + 1,
          })),
        ];

        onChange(nextImages);
        return nextImages;
      });
    } catch (uploadError) {
      console.error(uploadError);
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    const reindexed = next.map((img, i) => ({
      ...img,
      positionInListing: i + 1,
    }));
    setImages(reindexed);
    onChange(reindexed);
  };

  const deleteImage = async (listingImage: ListingImage, fileIndex: number) => {
    try {
      setError("");

      if (listingImage.id) {
        await deleteListingImage.mutateAsync({ id: listingImage.id });
      }

      if (listingImage.imagePath) {
        const storage = getStorage();
        await deleteObject(ref(storage, listingImage.imagePath));
      }

      const sortedImages = images
        .filter((_, index) => index !== fileIndex)
        .map((item, index) => ({
          ...item,
          positionInListing: index + 1,
        }));

      onChange(sortedImages);
      setImages(sortedImages);
    } catch (deleteError) {
      setError("Something went wrong. Please try again.");
      console.error(deleteError);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={hiddenFileInput}
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        multiple
      />

      <button
        onClick={handleFileInputClick}
        type="button"
        className="flex min-h-[156px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#B9CEF8] bg-[#F6F9FF] px-6 py-8 text-center transition hover:border-[#1F5FD6] hover:bg-[#EAF2FF]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1F5FD6] shadow-sm">
          <ArrowUpTrayIcon className="h-6 w-6" />
        </span>
        <span className="mt-4 text-sm font-bold text-[#1F2937]">
          Upload property photos
        </span>
        <span className="mt-1 text-sm text-[#64748B]">
          JPG or PNG. You can select multiple images.
        </span>
      </button>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {uploading && (
        <div className="rounded-xl border border-[#CFE0FF] bg-[#F6F9FF] px-4 py-3 text-sm font-semibold text-[#1F5FD6]">
          Uploading images...
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((item, index) => (
            <div
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
              key={`${item.imagePath || item.url}-${index}`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  alt="Property image"
                  src={item.url}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute left-3 top-3 flex gap-2">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1F5FD6] shadow-sm backdrop-blur">
                  {index + 1}
                </span>
                {index === 0 && (
                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1F2937] shadow-sm backdrop-blur">
                    Main
                  </span>
                )}
              </div>
              <div className="absolute right-3 top-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#4A5468] shadow-sm transition hover:bg-slate-100 disabled:opacity-30"
                  aria-label="Move left"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#4A5468] shadow-sm transition hover:bg-slate-100 disabled:opacity-30"
                  aria-label="Move right"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteImage(item, index)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-sm transition hover:bg-red-50"
                  aria-label="Delete image"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-[#64748B]">
          <PhotoIcon className="h-5 w-5 shrink-0 text-[#1F5FD6]" />
          No photos uploaded yet.
        </div>
      )}
    </div>
  );
};
