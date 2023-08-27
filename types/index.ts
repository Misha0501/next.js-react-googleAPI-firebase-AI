export type FirebaseAPISignInAuthResponse = {
    kind: string
    localId: string
    email: string
    idToken: string
    displayName: string
    registered: boolean
    refreshToken: string
    expiresIn: string
}