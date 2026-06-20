import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

const firebaseAdminCredentials = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
};

let app: App | undefined;

// Lazy on purpose: Next.js imports every route module at build time to
// collect page data. A route that merely imports this file — even one that
// never calls Firebase Admin, like /api/auth/logout — would otherwise force
// initializeApp() to run during the build and fail the entire build if the
// service account env vars aren't present for that build's environment.
export const getFirebaseAdminApp = (): App => {
  if (!app) {
    app =
      getApps().length === 0
        ? initializeApp({
            credential: cert(firebaseAdminCredentials as ServiceAccount),
          })
        : getApp();
  }

  return app;
};

let auth: Auth | undefined;

export const getFirebaseAdminAuth = (): Auth => {
  if (!auth) auth = getAuth(getFirebaseAdminApp());

  return auth;
};
