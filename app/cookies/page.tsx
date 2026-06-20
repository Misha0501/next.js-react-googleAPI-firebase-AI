import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/components/legal/LegalPage";
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl";

const title = "Cookie Policy — Homfli";
const description = "How Homfli uses cookies and similar technologies.";
const lastUpdated = "20 June 2026";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${getSiteUrl()}/cookies`,
  },
};

const CookiesPage = () => {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated={lastUpdated}
      intro={`This Cookie Policy explains how Homfli ("Homfli", "we", "us", or "our") uses cookies and similar technologies on homfli.com. Homfli is a Bulgarian real estate marketplace for browsing, buying, renting, saving, and managing property listings. The platform is currently in an early-stage development / preview phase. Some features may be incomplete, experimental, disabled, or subject to change. This Cookie Policy should be read together with our Privacy Policy and Terms of Service.`}
      sections={[
        {
          id: "what-are-cookies",
          title: "1. What are cookies?",
          body: (
            <div className="space-y-3">
              <p>
                Cookies are small text files that are stored on your device when
                you visit a website.
              </p>
              <p>Cookies can be used for different purposes, such as:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Keeping you logged in</li>
                <li>Remembering preferences</li>
                <li>Securing the website</li>
                <li>Measuring website usage</li>
                <li>Personalising content</li>
                <li>Showing advertising</li>
              </ul>
              <p>
                Some cookies are necessary for a website to work. Others
                require your consent, depending on their purpose and applicable
                law.
              </p>
            </div>
          ),
        },
        {
          id: "how-homfli-uses-cookies",
          title: "2. How Homfli uses cookies",
          body: (
            <div className="space-y-3">
              <p>
                At the current stage, Homfli uses cookies mainly for
                authentication and session management.
              </p>
              <p>
                Based on the current application codebase, Homfli does not set:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Analytics cookies</li>
                <li>Advertising cookies</li>
                <li>Retargeting pixels</li>
                <li>Browser fingerprinting scripts</li>
                <li>
                  Persistent device identifiers beyond authentication/session
                  tokens
                </li>
              </ul>
              <p>
                Homfli currently uses only necessary cookies for logged-in
                users.
              </p>
              <p>
                If we introduce analytics, advertising, marketing cookies,
                preference cookies, or other non-essential cookies in the
                future, we will update this Cookie Policy and request consent
                where required.
              </p>
            </div>
          ),
        },
        {
          id: "cookies-used",
          title: "3. Cookies currently used by Homfli",
          body: (
            <div className="space-y-6">
              <p>Homfli currently sets the following cookies:</p>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#F8FAFC]">
                      <th className="px-4 py-3 text-left font-bold text-[#1F2937]">
                        Cookie name
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#1F2937]">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#1F2937]">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-[#1F2937]">
                        Expiry
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">
                        __session
                      </td>
                      <td className="px-4 py-3">
                        Used to authenticate logged-in users with a Firebase
                        session credential
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        Necessary
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">7 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">3.1 __session</h3>
                <p className="mt-2">
                  The{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                    __session
                  </code>{" "}
                  cookie is used to keep logged-in users authenticated.
                </p>
                <p className="mt-2">
                  It contains a Firebase session credential, verified by our
                  servers on each request, and is required for secure access
                  to authenticated features such as saved listings, saved
                  searches, recently viewed listings, and company listing
                  management.
                </p>
                <p className="mt-2">
                  In production, this cookie is configured as:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                      httpOnly
                    </code>
                  </li>
                  <li>
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                      sameSite: lax
                    </code>
                  </li>
                  <li>
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                      secure
                    </code>
                  </li>
                </ul>
                <p className="mt-2">
                  This cookie cannot be read by JavaScript running in the
                  browser. Because it is necessary for authentication, it
                  cannot be disabled through the cookie consent banner without
                  affecting login functionality.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "cookie-categories",
          title: "4. Cookie categories",
          body: (
            <div className="space-y-6">
              <p>
                Homfli may classify cookies into the following categories.
              </p>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.1 Necessary cookies
                </h3>
                <p className="mt-2">
                  Necessary cookies are required for the website to work
                  properly.
                </p>
                <p className="mt-2">They may be used for:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Logging in</li>
                  <li>Keeping users authenticated</li>
                  <li>Securing sessions</li>
                  <li>Preventing abuse</li>
                  <li>Remembering cookie consent choices</li>
                  <li>Enabling core platform features</li>
                </ul>
                <p className="mt-2">
                  These cookies do not require consent, but they are still
                  explained in this Cookie Policy.
                </p>
                <p className="mt-2">Current necessary cookies include:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                      __session
                    </code>
                  </li>
                </ul>
                <p className="mt-2">
                  Silktide may also set necessary cookies to store your cookie
                  consent preferences.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.2 Preference cookies
                </h3>
                <p className="mt-2">
                  Preference cookies remember choices you make on the website,
                  such as interface settings or language preferences.
                </p>
                <p className="mt-2">
                  At the current stage, Homfli does not intentionally set
                  preference cookies through the application code itself.
                </p>
                <p className="mt-2">
                  If preference cookies are added later, they will be listed in
                  the Silktide preferences panel.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.3 Statistics cookies
                </h3>
                <p className="mt-2">
                  Statistics cookies help us understand how visitors use the
                  website.
                </p>
                <p className="mt-2">
                  At the current stage, Homfli does not intentionally set
                  analytics or statistics cookies through the application code
                  itself.
                </p>
                <p className="mt-2">
                  If analytics tools are added later, such as Google Analytics,
                  Plausible, PostHog, or similar services, they will be used
                  only in accordance with applicable law and consent
                  requirements, and will be listed in the Silktide preferences
                  panel.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.4 Marketing cookies
                </h3>
                <p className="mt-2">
                  Marketing cookies are used for advertising, retargeting,
                  campaign measurement, or personalised content.
                </p>
                <p className="mt-2">
                  At the current stage, Homfli does not intentionally set
                  advertising, retargeting, or marketing cookies through the
                  application code itself.
                </p>
                <p className="mt-2">
                  If marketing cookies are added later, they will require
                  consent where required by law and will be listed in the
                  Silktide preferences panel.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "silktide",
          title: "5. Silktide consent management",
          body: (
            <div className="space-y-3">
              <p>
                Homfli uses Silktide as its cookie consent management tool.
              </p>
              <p>
                Silktide displays a cookie banner when you visit Homfli.
                Through the banner, you may accept, reject, or customise
                non-essential cookies.
              </p>
              <p>
                You can reopen your preferences at any time by clicking
                &ldquo;Cookie Preferences&rdquo; in the site footer.
              </p>
            </div>
          ),
        },
        {
          id: "cookie-preferences-panel",
          title: "6. Cookie preferences panel",
          body: (
            <div className="space-y-3">
              <p>
                The Silktide preferences panel shows the cookie categories used
                on homfli.com and lets you manage your choices.
              </p>
              <p>
                At the current stage, Homfli only uses essential cookies, so
                the panel shows a single required category. If additional cookie
                categories are added in the future, they will appear here and
                require your consent where required by law.
              </p>
            </div>
          ),
        },
        {
          id: "manage-preferences",
          title: "7. Managing your cookie preferences",
          body: (
            <div className="space-y-3">
              <p>
                You can manage your cookie preferences at any time by clicking
                &ldquo;Cookie Preferences&rdquo; in the footer of any page.
              </p>
              <p>You may be able to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customise cookie categories</li>
                <li>Change or withdraw your consent later</li>
              </ul>
            </div>
          ),
        },
        {
          id: "browser-controls",
          title: "8. Browser cookie controls",
          body: (
            <div className="space-y-3">
              <p>
                You can also manage cookies directly through your browser
                settings.
              </p>
              <p>Most browsers allow you to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>View cookies</li>
                <li>Delete cookies</li>
                <li>Block cookies</li>
                <li>Block third-party cookies</li>
                <li>Clear cookies when closing the browser</li>
              </ul>
              <p>
                Please note that blocking necessary cookies may cause parts of
                Homfli to stop working properly, especially login and account
                features.
              </p>
            </div>
          ),
        },
        {
          id: "third-party-services",
          title: "9. Third-party services",
          body: (
            <div className="space-y-3">
              <p>
                Homfli uses third-party services that may process technical
                data or set cookies depending on how they are integrated.
              </p>
              <p>These services may include:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Firebase Authentication</li>
                <li>Firebase Storage / Google Cloud Storage</li>
                <li>Google Maps / Places API</li>
                <li>Resend</li>
                <li>Vercel</li>
                <li>Redis</li>
                <li>PostgreSQL database hosting providers</li>
                <li>OpenAI, if AI description functionality is enabled</li>
                <li>Silktide</li>
              </ul>
              <p>
                At the current stage, Homfli does not intentionally use
                analytics or advertising cookies through the application code
                itself.
              </p>
              <p>
                If third-party services set cookies or similar technologies,
                these will be listed in the Silktide preferences panel.
              </p>
            </div>
          ),
        },
        {
          id: "google-maps",
          title: "10. Google Maps and Places API",
          body: (
            <div className="space-y-3">
              <p>
                Homfli may use Google Maps / Places API for address
                autocomplete, property location features, and location-based
                search.
              </p>
              <p>
                When you use address autocomplete or map-related features,
                Google may process request data, address strings, IP address,
                and technical information according to Google&apos;s own terms
                and privacy practices.
              </p>
              <p>
                Depending on the technical implementation, Google services may
                set cookies or use similar technologies. If detected, these
                will be listed in the Silktide preferences panel.
              </p>
            </div>
          ),
        },
        {
          id: "authentication-cookies",
          title: "11. Authentication cookies and logged-in users",
          body: (
            <div className="space-y-3">
              <p>
                If you log in to Homfli, authentication cookies are needed to
                keep your session active.
              </p>
              <p>
                If you delete or block authentication cookies, you may be
                logged out or unable to use account features such as:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Saving listings</li>
                <li>Saving searches</li>
                <li>Viewing recently viewed listings</li>
                <li>Managing company profiles</li>
                <li>Creating or editing property listings</li>
                <li>Accessing protected pages</li>
              </ul>
            </div>
          ),
        },
        {
          id: "changes",
          title: "12. Changes to this Cookie Policy",
          body: (
            <div className="space-y-3">
              <p>
                We may update this Cookie Policy from time to time, especially
                as Homfli develops, new features are added, the consent
                configuration changes, or third-party services change.
              </p>
              <p>
                The updated version will be posted on this page with a new
                &ldquo;Last updated&rdquo; date.
              </p>
              <p>
                If changes are material, we may provide additional notice where
                appropriate.
              </p>
            </div>
          ),
        },
        {
          id: "contact",
          title: "13. Contact",
          body: (
            <div className="space-y-3">
              <p>
                For questions about this Cookie Policy, contact us at:
              </p>
              <p>
                Homfli
                <br />
                Website: homfli.com
                <br />
                Email: contact@homfli.com
              </p>
              <p>
                For more information about how we use your personal data, see
                our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#1F5FD6] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          ),
        },
      ]}
    />
  );
};

export default CookiesPage;
