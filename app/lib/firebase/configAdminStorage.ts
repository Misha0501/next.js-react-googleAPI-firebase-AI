import { getStorage } from "firebase-admin/storage";
import { firebaseAdminApp } from "@/app/lib/firebase/configAdmin";

export const firebaseAdminBucket = getStorage(firebaseAdminApp).bucket(
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
);
