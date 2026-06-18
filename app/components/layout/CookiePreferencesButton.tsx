"use client";

export const CookiePreferencesButton = () => (
  <button
    type="button"
    className="text-sm text-slate-300 transition-colors hover:text-white"
    onClick={() => {
      const mgr = (window as any).silktideConsentManager;
      if (!mgr) return;
      // getInstance().toggleModal(true) opens the preferences panel without resetting choices.
      // resetConsent() is the public fallback — it clears choices and reshows the prompt.
      const instance = mgr.getInstance?.();
      if (instance?.toggleModal) {
        instance.toggleModal(true);
      } else {
        mgr.resetConsent?.();
      }
    }}
  >
    Cookie Preferences
  </button>
);
