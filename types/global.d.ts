declare global {
  interface Window {
    initGoogleServices: (...args: unknown[]) => Promise<void>;
    google?: typeof google;
  }
}
