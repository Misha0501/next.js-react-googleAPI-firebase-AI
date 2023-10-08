/**
 * Loads a JS file dynamically
 * @param src The URL of the JS file to load
 * @param successCallback The callback to invoke when the JS file is loaded
 * @param errorCallback The callback to invoke when there's an error loading the JS file
 */
export const loadJS = (src: string, successCallback: () => void, errorCallback: (error: Event | string) => void): void => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = successCallback;
  script.onerror = errorCallback; // Capture loading errors
  document.body.appendChild(script);
};
