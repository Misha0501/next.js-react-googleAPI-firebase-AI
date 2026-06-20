const SignInLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {/* Warms up the connection Google sign-in's popup needs, so the first
        click doesn't pay the full DNS + TLS handshake cost. */}
    <link rel="preconnect" href="https://accounts.google.com" />
    <link
      rel="preconnect"
      href={`https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`}
    />
    {children}
  </>
);

export default SignInLayout;
