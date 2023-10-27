/**
 * Dynamically loads a JavaScript file.
 *
 * @param {string} src - URL of the JavaScript file.
 * @param {() => void} successCallback - Callback to execute when the script is successfully loaded.
 * @param {(error: Event | string) => void} errorCallback - Callback to execute if there's an error while loading the script.
 */
export const loadJS = (src: string, successCallback: () => void, errorCallback: (error: Event | string) => void): void => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = successCallback;
  script.onerror = errorCallback; // Capture loading errors
  document.body.appendChild(script);
};
