import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth/requireUser";
import { handleAPIError } from "@/app/lib/api/handleError";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getFirebaseAdminBucket } from "@/app/lib/firebase/configAdminStorage";
import { uniqueID } from "@/app/lib/uniqueID";

const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
};
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Uploads a property image via the Admin SDK. Direct client-to-Storage
 * uploads required a signed-in Firebase client session, which no longer
 * exists once the browser signs out of Firebase Auth right after the
 * session cookie is issued.
 */
export async function POST(req: Request) {
  try {
    const { user } = await requireUser(req);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      throw new ResponseError("A file is required.", 400);
    }

    const extension = ALLOWED_CONTENT_TYPES[file.type];
    if (!extension) {
      throw new ResponseError("Only JPEG and PNG images are allowed.", 400);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ResponseError("Image must be 10MB or smaller.", 400);
    }

    const imagePath = `publicImages/${uniqueID()}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const bucket = getFirebaseAdminBucket();
    const bucketFile = bucket.file(imagePath);
    await bucketFile.save(buffer, {
      contentType: file.type,
      // Resumable uploads are unnecessary (and fail to resolve an upload
      // URL in this environment) for files this small.
      resumable: false,
      metadata: {
        metadata: {
          applicationUserId: String(user.id),
          activity: "Property placement",
        },
      },
    });
    await bucketFile.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${imagePath}`;

    return NextResponse.json({ url, imagePath });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Deletes a Storage object by path, for images removed before the listing
 * (and its ListingImage rows) were ever saved.
 */
export async function DELETE(req: Request) {
  try {
    await requireUser(req);

    const { imagePath } = await req.json();

    if (
      typeof imagePath !== "string" ||
      !imagePath.startsWith("publicImages/")
    ) {
      throw new ResponseError("A valid imagePath is required.", 400);
    }

    await getFirebaseAdminBucket()
      .file(imagePath)
      .delete({ ignoreNotFound: true });

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
