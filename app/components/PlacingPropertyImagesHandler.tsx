import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import { Button } from "@tremor/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import Image from "next/image";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { ListingImage } from "@/types";
import { Popover } from "@headlessui/react";


type PlacingPropertyImagesHandlerProps = {
    onChange: (images: ListingImage[]) => void;
  initialImages?: ListingImage[];
};
export const PlacingPropertyImagesHandler = ({ onChange, initialImages }: PlacingPropertyImagesHandlerProps) => {
  const { user, authToken } = useAuthContext();

  const [images, setImages] = useState<ListingImage[]>(initialImages || []);

  const [error, setError] = useState("");

  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  const handleFileInputClick = () => hiddenFileInput.current?.click();

  const [firebaseUID, setFirebaseUID] = useState();
  const [uploading, setUploading] = useState(false);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("Starting handleFileChange");

      const files = e.target.files;
      const uid = user?.uid;

      if (!files || !files.length) {
        // no file selected
        console.log("no file selected");
        setError("Please select a file");
        return;
      }

      const file = files[0];
      console.log("file");
      console.log(file);

      console.log("uid: ", uid);
      if (!uid) {
        console.log("no uid");
        setError("Please (re)log in");
        return;
      }
      setUploading(true);

      let fileName = file.name;

      // replace all file extensions with .jpg
      fileName = fileName.replace(/\.[^/.]+$/, ".jpg");

      // Create a root reference
      const storage = getStorage();

      const imagePath = `publicImages/${fileName}`;

      // Create a reference to the image
      const imageRef = ref(storage, imagePath);

      // Create custom metadata to store in Firebase Storage
      const metadata = {
        customMetadata: {
          firebaseUID: uid,
          activity: "Hiking",
        },
      };

      // Upload file and metadata to the firebase storage
      await uploadBytes(imageRef, file, metadata);

      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);
      console.log("downloadURL: ", downloadURL);

      // Add the image to the images state
      setImages((prevState) => {
        const image = {
          url: downloadURL,
          positionInListing: images.length,
          imagePath,
        };
        prevState.push(image);
        onChange([...prevState]);
        return [...prevState];
      });

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      setError("Something went wrong. Please try again.");
    }
    console.log(images);
  };

  const deleteImage = async (listingImage: ListingImage, fileIndex: number) => {
    console.log("deleteImage: ", fileIndex);
    console.log("deleteImage: ", listingImage);
    try {
      if (listingImage.id) {
        // if the image is already saved in the database, we need to delete it from the database
        const response = await fetch(`/api/listingImages/${listingImage.id}`, {
          method: "DELETE",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: authToken,
          },
        });

        console.log("File deleted successfully from the db");
      }

      // Delete the file from the firebase storage
      const storage = getStorage();

      // Create a reference to the file to delete
      const desertRef = ref(storage, listingImage.imagePath);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          console.log("File deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          setError("Something went wrong. Please try again.");
          console.error(error);
        });

      // remove the image from the images state
      images.splice(fileIndex, 1);

      // reassign positionInListing
      const sortedImages = images.map((item, index) => {
        item.positionInListing = index;
        return item;
      });

      onChange(sortedImages);
      setImages([...sortedImages]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <input
        type="file"
        ref={hiddenFileInput}
        className={"hidden"}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
      />

      <div className="flex flex-col gap-5 mb-8">
        {images &&
          images.map((item, index) => (
            <div className={"relative"} key={index}>
              {index === 0 && (
                <div className="absolute left-6 top-6 px-6 py-2 rounded-xl bg-white drop-shadow-2xl">
                  Main image
                </div>
              )}
              <div className="absolute bottom-6 left-6 px-6 py-2 rounded-xl bg-white drop-shadow-2xl">
                {item.positionInListing}
              </div>
              <Popover className="absolute right-6 top-6 outline-0">
                <Popover.Button className={"focus-visible:outline-none"}>
                  <div className="shadow-2xl p-1 rounded-full backdrop-blur bg-gray-400/20 cursor-pointer">
                    <EllipsisHorizontalIcon
                      className={"h-10 w-10 text-white"}
                    ></EllipsisHorizontalIcon>
                  </div>
                </Popover.Button>

                <Popover.Panel className="absolute z-10 right-0 w-max">
                  <div className="flex flex-col bg-white rounded-xl">
                    <Popover.Button
                      onClick={() => {
                        deleteImage(item, index);
                      }}
                      className={"px-6 py-2"}
                    >
                      Delete
                    </Popover.Button>
                  </div>

                  <img src="/solutions.jpg" alt="" />
                </Popover.Panel>
              </Popover>

              <Image
                alt="Property image"
                src={item.url}
                width={676}
                height={410}
                layout="responsive"
                placeholder={"blur"}
                blurDataURL={
                  "data:image/webp;base64,UklGRpQHAABXRUJQVlA4WAoAAAAgAAAAXgIATgEASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggpgUAAFBNAJ0BKl8CTwE+tVCjT6ckI6IhkHrg4BaJaW7gCrWDuPNqdDFqC4DxLfXU/3d+QAetmFPp3MKfTMhTpQkQyNlQZMSKgyYstxvIBfrwJ1wGp/n9ugoeLI8LULNG9neVRGztZKfXeUFT6N5Q6svl8kFxKFx2aW+Cuswm8cvxMFJZAa1X1i7LqHCfaUPKGCARGS2Ga0+Nj9MzWnwn7G6tdTwtqHCghWtKoW18oHTORcshta0ci/TNgreDSlCfcAShIWtKo1O+ayuRCdaUNqVshsCZxB7Y1tKG0CR5gobQ2gSFrSqPtNQ83/hpW0RPtR3vys3xcKi0fNMZ4ySZsiE65syhdzSty5xygwHShn3r/xQBU6GrRciE+1Hf4bTGdKH7Bwn2dJqHtyrSo1X3hw+cyQtqIiakLaBs//rSv6sEAOlD9sl3hX7Cr7fvc2TGEFHCAeXrUTFWrh/Y2WYL5pC5QwHShs7TfXCMZXn+2AgO/hpfUtsMkR3VQB3woeX6aVQtpr2037aifXn5EzRrn0/+107IZWq4nfEoSFrSqFp9ceZJXgy7IxKkU1wQUuI2aHlenEraInWlDPm+uF3jRaEW3Conv4HrvrfJ1wIjQf8g0ROah6A7XPp6Ad+RM0a6AUzpn2tbgUDNgKQJBdAdrn09AO/ImaNc+rBfnfdDJeIn0qtKHUUExu5wbRZ9VfOzCgFRyLZP//E4Sfsbq3kMlOl2N5Ce/d8IZnYltxVbL1fdfzhY0Gz2qDY1f7gj3StaJdR7+B68aMr8TWOSP+fZP3XlAO/ImaNc+noB35LDLw0A/oztqCfeEOefPbZrB5LeD22YDzEEAAD+7urf59OJ3u/E2dmQEywKwfdw9g+jjwrno1e7LoOB59W4g7MZVTaHBakwCnJxQaD5SjXCYmdHv537fDf+DUdII5C3HIpi2Nh4I7cccj7Q8KENNXGEcANTzOsH81gibhZ8XgfX6Qg61q/i/wah8+bYXx/RN+pf9QSMcx6XP46ymjjVP/MV1X6v0GalkPhzucnJOt88FnJSHA9xjszfCe9F+cepha5tEP7H+YU8PqxguJfPOJ5Z6QcBqX+huR1+Om1etyeXYpQeJZhO50S4Bt/gco705OZaY/TFWKAYhMM6JnwEWDjJvjlSEoFE7Ul4B5VxfyfytP0r40fF9Cv7k7PhPZ0X1mh0X3eW6BUUvB/TAIkXeTgn9wSsOYusaujyxUO8j1NzPk0YQZW83JKGk66+4ouUFFYke4dTLm4XCwgWeVMJarNdyWtyXxl90V1QOyTg6KgqGAV2f9s3Ec4VsNjJgov1lGkYL23Z5/4QTw6CS7IhTGfgKSUjymc3uv/4GYF9hF9PCPzftmvW+ZdyC4rgBSIg3C7Rs1T1JHVQEV13c0XhgNQ2A5sclVeD89SAsGAr+Dn3nZa7E4lBP2GJAt6wWcEAczihban5MmjnulzJFU6x/YNumY6veDqhl30Zt4puTFpluaWx+ADH+TS7e96TkHvtmbuey0UhxH5f4MKx9iSxP02NAD8Q7f6Qp0XGdSmitegHGsaQgt16Rs/TNK8fsW/oBaZ+22yq02hxcQeSabi3f0nn42VAzMBa6HeGC3+mlWWwfiPQkOO3FfrF1+p/OVLae4Agk/nifI/VwV4wr7etfCbKHYtakMp3M1d/9KghQ08yLlLc/zwzEQAAKbWl1X+Lzv5XUSok1/atsE7ucB7JiED7F9SPpefnnI6UgABLywnw09RjCJroFxsqGc8W6SIjjeVoHZ/p4gANZQfeJVRD+FYWob9zm25d/5I9OxcQlAivrCAA4bPtaiHT5YZBycr7BQVtvzvAAAHQkLsEBjPjmW6aKS4m6UhIyfCWcAACaKRslaALr3MJpJblwmVngAAYNiJASprauIfOPyMqQAAbcSXJ4+Ch4o8CxeAAAAAAAA=="
                }
                className={"rounded-xl h-32 border"}
              />
            </div>
          ))}
        {uploading && <p>Uploading...</p>}
      </div>
      <Button onClick={handleFileInputClick} variant={"secondary"} className={"w-full"}>Add picture</Button>
    </div>
  );
};
