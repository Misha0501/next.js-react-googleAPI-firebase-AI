import admin from 'firebase-admin'
import { firebaseAdminCredentials } from './firebaseAdminCredentials'

try {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminCredentials),
    })

} catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack)
    }
}

export const firebaseAdmin = admin;
