declare global {
  interface Window {
    initGoogleServices: () => void;
    google: any;
  }
}
