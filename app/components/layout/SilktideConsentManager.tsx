import Script from "next/script";

const SILKTIDE_CSS_URL =
  "https://cdn.jsdelivr.net/gh/silktide/consent-manager@v2.0.0/silktide-consent-manager.css";
const SILKTIDE_JS_URL =
  "https://cdn.jsdelivr.net/gh/silktide/consent-manager@v2.0.0/silktide-consent-manager.js";
const SILKTIDE_CSS_INTEGRITY =
  "sha384-IO1E/jCrQXyH5rwcI0SXP7OXw47JFqQNDQcKhbFvqnL2IunBxxwE2Ne5XyAmCqKs";
const SILKTIDE_JS_INTEGRITY =
  "sha384-j4NIMOecmtzMWe9GJADIIe5hTlHG63aiTQ/2XorW10RNyQJg+IU+xwFVDy45wBah";

// Matches Homfli's primary blue. The floating icon is hidden — users open
// preferences via the "Cookie Preferences" link in the footer instead.
const CSS_OVERRIDES = `#stcm-wrapper {
  --boxShadow: -5px 5px 10px 0px #00000012, 0px 0px 50px 0px #0000001a;
  --fontFamily: Helvetica Neue, Segoe UI, Arial, sans-serif;
  --primaryColor: #1F5FD6;
  --backgroundColor: #FFFFFF;
  --textColor: #253B48;
  --backdropBackgroundColor: #00000033;
  --backdropBackgroundBlur: 0px;
  --iconColor: #1F5FD6;
  --iconBackgroundColor: #FFFFFF;
}
#stcm-icon { display: none !important; }`;

const INIT_SCRIPT = `window.silktideConsentManager.init({
  backdrop: { show: true },
  prompt: { position: "bottomRight" },
  consentTypes: [
    {
      id: "essential",
      label: "Essential",
      description: "<p>These cookies are necessary for the website to function properly and cannot be switched off. They are used for authentication and session management.</p>",
      required: true
    }
  ],
  text: {
    prompt: {
      description: "<p>We use cookies on homfli.com to keep you logged in and secure your session. We do not currently use analytics, advertising, or tracking cookies.</p>",
      acceptAllButtonText: "Accept",
      acceptAllButtonAccessibleLabel: "Accept cookies",
      rejectNonEssentialButtonText: "Reject non-essential",
      rejectNonEssentialButtonAccessibleLabel: "Reject all non-essential cookies",
      preferencesButtonText: "Preferences",
      preferencesButtonAccessibleLabel: "Toggle cookie preferences"
    },
    preferences: {
      title: "Cookie preferences",
      description: "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>",
      saveButtonText: "Save and close",
      saveButtonAccessibleLabel: "Save your cookie preferences",
      creditLinkText: "Cookie settings by Silktide",
      creditLinkAccessibleLabel: "Cookie settings by Silktide"
    }
  }
});`;

export const SilktideConsentManager = () => (
  <>
    <link
      rel="preconnect"
      href="https://cdn.jsdelivr.net"
      crossOrigin="anonymous"
    />
    <link
      rel="stylesheet"
      id="silktide-consent-manager-css"
      href={SILKTIDE_CSS_URL}
      integrity={SILKTIDE_CSS_INTEGRITY}
      crossOrigin="anonymous"
    />
    <style
      id="silktide-consent-manager-overrides"
      dangerouslySetInnerHTML={{ __html: CSS_OVERRIDES }}
    />
    <Script
      id="silktide-js"
      src={SILKTIDE_JS_URL}
      integrity={SILKTIDE_JS_INTEGRITY}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
    <Script
      id="silktide-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }}
    />
  </>
);
