import { getStorage } from "firebase-admin/storage";
import { getFirebaseAdminApp } from "@/app/lib/firebase/configAdmin";

let bucket: ReturnType<ReturnType<typeof getStorage>["bucket"]> | undefined;

// Lazy for the same reason as getFirebaseAdminApp/getFirebaseAdminAuth — see
// app/lib/firebase/configAdmin.ts.
export const getFirebaseAdminBucket = () => {
  if (!bucket) {
    bucket = getStorage(getFirebaseAdminApp()).bucket(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    );
  }

  return bucket;
};
