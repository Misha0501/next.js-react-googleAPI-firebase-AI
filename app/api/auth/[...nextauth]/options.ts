import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

export const options: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "email",
                    placeholder: "Your email"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Your password"
                }
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                const user = { id: "42", email: "misha.galenda@gmail.com", password: "test" }

                if (credentials?.email === user.email && credentials?.password === user.password) {
                    return user;
                } else {
                    return null
                }
            }
        })
    ],
}