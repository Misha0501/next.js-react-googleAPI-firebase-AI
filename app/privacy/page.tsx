import type { Metadata } from "next";
import { LegalPage } from "@/app/components/legal/LegalPage";
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl";

const title = "Privacy Policy — Homfli";
const description =
  "Privacy policy for Homfli — how we collect, use, and protect your data.";
const lastUpdated = "17 June 2026";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
  },
};

const PrivacyPage = () => {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={lastUpdated}
      intro={`This Privacy Policy explains how Homfli ("Homfli", "we", "us", or "our") collects, uses, stores, and protects personal data when you use our website and platform at homfli.com. Homfli is a Bulgarian real estate marketplace for browsing, buying, renting, saving, and managing property listings. The platform is currently in an early-stage development / preview phase. You should not rely on Homfli as the only source of information for real estate decisions or actual property transactions. Listing information may be incomplete, outdated, inaccurate, or used for testing and demonstration purposes. This Privacy Policy applies to visitors, registered users, real estate agents, company members, and anyone who contacts us through the platform.`}
      sections={[
        {
          id: "controller",
          title: "1. Who is responsible for your personal data?",
          body: (
            <div className="space-y-3">
              <p>
                For the purposes of the General Data Protection Regulation
                (&ldquo;GDPR&rdquo;), the data controller is:
              </p>
              <p>
                Homfli, currently operated by an individual platform owner.
                <br />
                <br />
                Public business address: Not currently listed. Please contact us
                by email for privacy, legal, or platform-related requests.
                <br />
                <br />
                Email: contact@homfli.com
                <br />
                <br />
                Company registration number: Not applicable &mdash; Homfli is
                not yet operated through a registered company.
                <br />
                VAT number: Not applicable &mdash; Homfli is not currently VAT
                registered.
              </p>
              <p>
                If Homfli is incorporated as a legal entity in the future, this
                Privacy Policy will be updated to reflect the correct controller
                details.
              </p>
            </div>
          ),
        },
        {
          id: "data-collection",
          title: "2. What personal data we collect",
          body: (
            <div className="space-y-6">
              <p>
                We collect different types of personal data depending on how you
                use Homfli.
              </p>

              <div>
                <h3 className="font-bold text-[#1F2937]">2.1 Account data</h3>
                <p className="mt-2">
                  When you create or use a Homfli account, we may collect:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Email address</li>
                  <li>Display name</li>
                  <li>Phone number, if provided</li>
                  <li>
                    Authentication identifiers, such as Firebase UID and
                    provider ID
                  </li>
                  <li>Account creation date</li>
                  <li>Last-updated timestamp</li>
                </ul>
                <p className="mt-2">
                  We use this data to create and manage your account,
                  authenticate you, secure your session, and provide
                  account-related functionality.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.2 Company and agency data
                </h3>
                <p className="mt-2">
                  If you create, join, or manage a company or real estate agency
                  profile, we may collect:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Company name</li>
                  <li>Company phone number</li>
                  <li>Company email address</li>
                  <li>Company description</li>
                  <li>Company street address</li>
                  <li>Locality</li>
                  <li>Postal code</li>
                  <li>Latitude and longitude of the company location</li>
                </ul>
                <p className="mt-2">
                  This information may be used to display agency information on
                  Homfli, manage company membership, and allow company members
                  to create or manage listings.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.3 Property listing data
                </h3>
                <p className="mt-2">
                  When agents, companies, or authorised users create property
                  listings, Homfli may process listing data such as:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Property type</li>
                  <li>Listing type, such as sale or rent</li>
                  <li>Price and currency</li>
                  <li>
                    Street, house number, postal code, locality, neighbourhood,
                    latitude, and longitude
                  </li>
                  <li>
                    Number of rooms, bedrooms, bathrooms, parking spaces, floor,
                    and total floors
                  </li>
                  <li>
                    Total area, living area, land area, outside area, and garage
                    area
                  </li>
                  <li>Year built</li>
                  <li>Interior type</li>
                  <li>Upkeep condition</li>
                  <li>Heating type</li>
                  <li>Free-text description and key points</li>
                  <li>Photos</li>
                  <li>Active status</li>
                  <li>Expiry date</li>
                </ul>
                <p className="mt-2">
                  Some listing data may relate to a property, an agency, or the
                  person who created the listing. Property addresses and photos
                  may be visible to users of the platform, depending on how the
                  listing is published.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">2.4 Saved listings</h3>
                <p className="mt-2">
                  If you are logged in and save or bookmark a listing, we store
                  the relationship between your account and the listing.
                </p>
                <p className="mt-2">
                  We use this to show your saved listings and allow you to
                  remove them later.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">2.5 Saved searches</h3>
                <p className="mt-2">
                  If you save a property search, we store the search criteria
                  connected to your account. This may include filters such as:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Location</li>
                  <li>Property type</li>
                  <li>Listing type</li>
                  <li>Price range</li>
                  <li>Area range</li>
                  <li>Room count</li>
                  <li>Other selected filters</li>
                </ul>
                <p className="mt-2">
                  We use saved searches to allow you to access them later and,
                  where enabled, to send you notifications when matching
                  listings are available.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.6 Recently viewed listings
                </h3>
                <p className="mt-2">
                  When you are logged in and view listing pages, we may store
                  which listings you recently opened.
                </p>
                <p className="mt-2">
                  We use this to provide a recently viewed listings feature and
                  improve your user experience.
                </p>
                <p className="mt-2">
                  At the moment, recently viewed listing records are retained
                  indefinitely unless removed manually or through future
                  platform functionality.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.7 Contact form data
                </h3>
                <p className="mt-2">
                  If you contact us through the contact form, we collect:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number, if provided</li>
                  <li>Subject, if provided</li>
                  <li>Message content</li>
                </ul>
                <p className="mt-2">
                  The contact form also contains a hidden anti-spam field. If
                  this field is filled in, the submission may be treated as a
                  bot submission and silently discarded.
                </p>
                <p className="mt-2">
                  Contact form submissions are not stored in our main database.
                  They are forwarded by email to contact@homfli.com through our
                  email provider.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.8 Company membership invites
                </h3>
                <p className="mt-2">
                  If you invite someone to join a company or agency on Homfli,
                  or if you receive such an invite, we may process:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Sender user ID</li>
                  <li>Recipient email address</li>
                  <li>Company details</li>
                  <li>Assigned role</li>
                  <li>Invite expiry date</li>
                  <li>Accepted or declined timestamps</li>
                </ul>
                <p className="mt-2">
                  We use this data to manage company access and permissions.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.9 Invoices and subscriptions
                </h3>
                <p className="mt-2">
                  If subscription or invoicing functionality is used, we may
                  process:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>User account linked to the invoice or subscription</li>
                  <li>Company linked to the invoice or subscription</li>
                  <li>Amount</li>
                  <li>Description</li>
                  <li>Invoice or subscription date fields</li>
                  <li>Subscription plan</li>
                  <li>Start date, end date, renewal date, cancellation date</li>
                </ul>
                <p className="mt-2">
                  At the current stage, Homfli does not appear to process
                  payment card data directly and no payment gateway integration
                  has been identified in the application codebase.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  2.10 IP addresses and security data
                </h3>
                <p className="mt-2">
                  We may read IP addresses from request headers for security and
                  rate-limiting purposes.
                </p>
                <p className="mt-2">
                  For example, IP addresses may be used to limit login attempts,
                  such as a maximum number of login attempts per minute per IP
                  address.
                </p>
                <p className="mt-2">
                  IP addresses are stored only temporarily in Redis for the
                  relevant rate-limit window and are not stored in the main
                  database.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "data-use",
          title: "3. How we use your personal data",
          body: (
            <div className="space-y-3">
              <p>We use personal data for the following purposes:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>To provide and operate the Homfli platform</li>
                <li>To allow users to create and manage accounts</li>
                <li>To authenticate users and keep sessions secure</li>
                <li>To allow users to browse, save, and manage listings</li>
                <li>
                  To allow agents and companies to create and manage property
                  listings
                </li>
                <li>To manage company memberships and invitations</li>
                <li>To provide saved searches and recently viewed listings</li>
                <li>To send service-related and transactional emails</li>
                <li>To forward contact form messages to Homfli</li>
                <li>To prevent abuse, spam, and unauthorised login attempts</li>
                <li>To maintain platform security</li>
                <li>To debug, maintain, and improve the platform</li>
                <li>To comply with legal obligations where applicable</li>
              </ul>
            </div>
          ),
        },
        {
          id: "legal-bases",
          title: "4. Legal bases for processing",
          body: (
            <div className="space-y-6">
              <p>
                Under the GDPR, we rely on different legal bases depending on
                the type of processing.
              </p>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.1 Performance of a contract
                </h3>
                <p className="mt-2">
                  We process account data, listing data, saved listings, saved
                  searches, company membership data, and subscription-related
                  data where this is necessary to provide the Homfli service to
                  you.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.2 Legitimate interests
                </h3>
                <p className="mt-2">
                  We may process data based on our legitimate interests,
                  including:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Securing the platform</li>
                  <li>Preventing spam, abuse, and unauthorised access</li>
                  <li>Rate limiting login attempts</li>
                  <li>Maintaining platform functionality</li>
                  <li>Improving the user experience</li>
                  <li>
                    Keeping records of platform actions needed to operate the
                    service
                  </li>
                </ul>
                <p className="mt-2">
                  Where we rely on legitimate interests, we consider whether
                  your rights and freedoms override those interests.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">4.3 Consent</h3>
                <p className="mt-2">
                  We may rely on consent where required, for example for
                  optional features, certain types of notifications, or future
                  analytics or marketing cookies if these are introduced.
                </p>
                <p className="mt-2">
                  At the current stage, Homfli does not set analytics,
                  advertising, retargeting, or tracking cookies through the
                  application code itself.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  4.4 Legal obligation
                </h3>
                <p className="mt-2">
                  We may process or retain certain data where required by
                  applicable law, accounting obligations, tax obligations,
                  dispute resolution, or requests from public authorities.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "authentication",
          title: "5. Authentication and session cookies",
          body: (
            <div className="space-y-3">
              <p>
                Homfli uses Firebase Authentication, provided by Google
                infrastructure, to authenticate users. Supported login methods
                may include email/password login and Google Sign-In.
              </p>
              <p>When you log in, Homfli may set the following cookies:</p>
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
                        Expiry
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-mono text-xs">authToken</td>
                      <td className="px-4 py-3">
                        Session authentication with a Firebase JWT ID token
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">1 day</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">
                        refreshToken
                      </td>
                      <td className="px-4 py-3">
                        Hourly session renewal with Firebase
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">1 day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  authToken
                </code>{" "}
                cookie is set as{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  httpOnly
                </code>
                ,{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  sameSite: strict
                </code>
                , and{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  secure
                </code>{" "}
                in production.
              </p>
              <p>
                The{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  refreshToken
                </code>{" "}
                cookie is not{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  httpOnly
                </code>{" "}
                because client-side JavaScript currently reads it to renew the
                session. It is set as{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  sameSite: strict
                </code>{" "}
                and{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  secure
                </code>{" "}
                in production.
              </p>
              <p>
                These cookies are necessary for login and session functionality.
                Without them, authenticated parts of Homfli may not work
                properly.
              </p>
            </div>
          ),
        },
        {
          id: "cookies-tracking",
          title: "6. Cookies and tracking",
          body: (
            <div className="space-y-3">
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
                Homfli currently uses only necessary authentication cookies for
                logged-in users.
              </p>
              <p>
                If we introduce analytics, advertising, marketing cookies, or a
                consent management tool in the future, we will update this
                Privacy Policy and our Cookie Policy accordingly.
              </p>
            </div>
          ),
        },
        {
          id: "emails",
          title: "7. Emails and notifications",
          body: (
            <div className="space-y-6">
              <p>Homfli may send or process the following emails:</p>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  7.1 Contact form forwarding
                </h3>
                <p className="mt-2">
                  When you submit the contact form, your name, email address,
                  phone number if provided, subject if provided, and message are
                  forwarded to contact@homfli.com.
                </p>
                <p className="mt-2">
                  No automatic copy is currently sent to the submitter.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  7.2 Saved search notifications
                </h3>
                <p className="mt-2">
                  Homfli contains functionality for saved-search match
                  notifications. If enabled, users may receive emails when new
                  listings match their saved search criteria.
                </p>
                <p className="mt-2">
                  These emails may include your email address and matched
                  listing details.
                </p>
                <p className="mt-2">
                  At the current stage, this saved-search notification
                  functionality is disabled in the application code. If enabled
                  later, Homfli may keep a record of which saved-search
                  notifications have already been sent in order to prevent
                  duplicate notifications.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "ai-descriptions",
          title: "8. AI-generated property descriptions",
          body: (
            <div className="space-y-3">
              <p>
                Homfli includes functionality for AI-generated property
                descriptions using OpenAI.
              </p>
              <p>
                At the current stage, this feature is disabled and returns an
                unavailable response.
              </p>
              <p>
                If this feature is re-enabled, property description text and
                related listing content may be sent to OpenAI to generate or
                improve descriptions. We will update this Privacy Policy where
                necessary before or when this feature becomes active.
              </p>
              <p>
                You should not enter sensitive personal data into listing
                descriptions or AI description tools.
              </p>
            </div>
          ),
        },
        {
          id: "third-parties",
          title: "9. Third-party service providers",
          body: (
            <div className="space-y-6">
              <p>
                We use third-party service providers to operate Homfli. These
                providers may process personal data on our behalf or as
                independent controllers, depending on the context.
              </p>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  9.1 Firebase Authentication
                </h3>
                <p className="mt-2">
                  Firebase Authentication, provided by Google, is used to
                  authenticate users and issue session tokens. It may process
                  email addresses and authentication metadata.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  9.2 Firebase Storage / Google Cloud Storage
                </h3>
                <p className="mt-2">
                  Listing photos are stored using Firebase Storage / Google
                  Cloud Storage. Image URLs may contain Google access tokens.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  9.3 Google Maps and Places API
                </h3>
                <p className="mt-2">
                  Google Maps / Places API may be used for address autocomplete
                  and location-related search features. When you type an address
                  into relevant fields, address strings and related request data
                  may be sent to Google.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">9.4 Resend</h3>
                <p className="mt-2">
                  Resend is used for transactional email delivery. It may
                  process contact form submissions and saved-search notification
                  emails.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">9.5 Vercel</h3>
                <p className="mt-2">
                  Homfli is hosted on Vercel. HTTP requests to Homfli pass
                  through Vercel infrastructure. Vercel may process IP
                  addresses, request metadata, logs, and technical information
                  necessary to host and secure the platform.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">9.6 Redis</h3>
                <p className="mt-2">
                  Redis is used as an in-memory store for rate limiting. IP
                  addresses and user IDs may be stored temporarily for security
                  and usage-limiting purposes. These entries expire
                  automatically and are not intended for long-term storage.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  9.7 PostgreSQL database
                </h3>
                <p className="mt-2">
                  Homfli uses a cloud-hosted PostgreSQL database as the primary
                  storage for user, company, listing, saved listing, saved
                  search, recently viewed listing, invite, invoice, and
                  subscription data.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">9.8 OpenAI</h3>
                <p className="mt-2">
                  OpenAI may be used for AI-generated property descriptions if
                  the feature is re-enabled. At the current stage, this feature
                  is disabled.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "international-transfers",
          title: "10. International data transfers",
          body: (
            <div className="space-y-3">
              <p>
                Some of our service providers may process data outside Bulgaria
                or outside the European Economic Area.
              </p>
              <p>
                Where personal data is transferred outside the EEA, we rely on
                appropriate safeguards where required, such as adequacy
                decisions, Standard Contractual Clauses, or other lawful
                transfer mechanisms under the GDPR.
              </p>
            </div>
          ),
        },
        {
          id: "retention",
          title: "11. How long we keep your data",
          body: (
            <div className="space-y-6">
              <p>
                We keep personal data only for as long as necessary for the
                purposes described in this Privacy Policy, unless a longer
                retention period is required or permitted by law.
              </p>

              <div>
                <h3 className="font-bold text-[#1F2937]">11.1 User accounts</h3>
                <p className="mt-2">
                  User account data is retained indefinitely unless manually
                  deleted by an administrator or unless deletion is required by
                  law. There is currently no self-service account deletion
                  feature.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">11.2 Listings</h3>
                <p className="mt-2">
                  Listings are soft-deleted. This means that when a listing is
                  deleted, a deletion timestamp is set, but the record is not
                  automatically removed from the database. As a result, property
                  data, address data, and related listing content may be
                  retained indefinitely unless manually deleted or unless a
                  different retention process is introduced.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  11.3 Recently viewed listings
                </h3>
                <p className="mt-2">
                  Recently viewed listings are currently retained indefinitely
                  per logged-in user. No automatic cleanup period is currently
                  implemented.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  11.4 Saved listings and saved searches
                </h3>
                <p className="mt-2">
                  Saved listings and saved searches are retained until you
                  delete them or until they are manually deleted by an
                  administrator.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  11.5 Contact form data
                </h3>
                <p className="mt-2">
                  Contact form submissions are not stored in the main database.
                  They are forwarded by email to Homfli. Copies may remain in
                  Homfli&apos;s email inbox or email provider systems according
                  to email retention settings.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  11.6 Rate-limit data
                </h3>
                <p className="mt-2">
                  Rate-limit entries stored in Redis are temporary and expire
                  automatically within the relevant rate-limit window.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F2937]">
                  11.7 Invoices and subscriptions
                </h3>
                <p className="mt-2">
                  Invoice and subscription records may be retained for as long
                  as needed for accounting, tax, legal, administrative, or
                  dispute-resolution purposes.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "your-rights",
          title: "12. Your GDPR rights",
          body: (
            <div className="space-y-3">
              <p>
                Depending on the situation and applicable law, you may have the
                following rights in relation to your personal data:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The right to be informed about how your data is used</li>
                <li>The right to access your personal data</li>
                <li>The right to correct inaccurate or incomplete data</li>
                <li>The right to request deletion of your data</li>
                <li>The right to restrict processing</li>
                <li>The right to object to processing</li>
                <li>The right to data portability</li>
                <li>
                  The right to withdraw consent where processing is based on
                  consent
                </li>
                <li>
                  The right to lodge a complaint with a supervisory authority
                </li>
              </ul>
              <p>
                Some rights may not apply in all circumstances. For example, we
                may need to retain certain data for legal, accounting, security,
                or dispute-resolution reasons.
              </p>
            </div>
          ),
        },
        {
          id: "exercise-rights",
          title: "13. How to exercise your rights",
          body: (
            <div className="space-y-3">
              <p>To exercise your privacy rights, contact us at:</p>
              <p>
                <br />
                contact@homfli.com
              </p>
              <p>
                Please include enough information for us to identify your
                account and understand your request.
              </p>
              <p>
                We may need to verify your identity before responding to a
                request. We aim to respond within the time limits required by
                applicable data protection law.
              </p>
              <p>
                At the current stage, Homfli does not provide a self-service
                data export or account deletion feature. If you want to request
                access, deletion, correction, or export of your data, please
                contact us by email.
              </p>
            </div>
          ),
        },
        {
          id: "supervisory-authority",
          title: "14. Supervisory authority",
          body: (
            <div className="space-y-3">
              <p>
                If you believe your personal data has been processed unlawfully
                or your rights have not been respected, you have the right to
                lodge a complaint with a data protection supervisory authority.
              </p>
              <p>In Bulgaria, the relevant authority is:</p>
              <p>
                Commission for Personal Data Protection
                <br />
                Republic of Bulgaria
                <br />
                Website:{" "}
                <a
                  href="https://www.cpdp.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1F5FD6] hover:underline"
                >
                  cpdp.bg
                </a>
              </p>
              <p>
                You may also contact the supervisory authority in the EU Member
                State where you live, work, or where you believe an infringement
                has occurred.
              </p>
            </div>
          ),
        },
        {
          id: "security",
          title: "15. Security",
          body: (
            <div className="space-y-3">
              <p>
                We use technical and organisational measures designed to protect
                personal data against unauthorised access, loss, misuse,
                alteration, or disclosure. These measures may include:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Firebase Authentication</li>
                <li>Secure session cookies in production</li>
                <li>
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                    httpOnly
                  </code>{" "}
                  authentication token cookie
                </li>
                <li>
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                    sameSite: strict
                  </code>{" "}
                  cookies
                </li>
                <li>HTTPS in production</li>
                <li>Rate limiting for login protection</li>
                <li>Role-based and company-based access controls</li>
                <li>Invitation-based company membership</li>
                <li>Access restrictions for listing management features</li>
              </ul>
              <p>
                However, no online platform can guarantee absolute security. You
                are responsible for keeping your login credentials secure and
                for notifying us if you suspect unauthorised access to your
                account.
              </p>
            </div>
          ),
        },
        {
          id: "access-control",
          title: "16. Access control and visibility",
          body: (
            <div className="space-y-3">
              <p>Unauthenticated users can browse and view public listings.</p>
              <p>
                Authenticated users can save listings, save searches, view
                recently viewed listings, and submit contact forms.
              </p>
              <p>
                Company members can create and manage listings on behalf of a
                real estate agency or company, depending on their assigned role.
              </p>
              <p>
                Company membership is invitation-based. Invitations are sent to
                an email address and may have an expiry date.
              </p>
            </div>
          ),
        },
        {
          id: "children",
          title: "17. Children",
          body: (
            <div className="space-y-3">
              <p>
                Homfli is not intended for use by children. We do not knowingly
                collect personal data from children.
              </p>
              <p>
                If you believe that a child has provided personal data to
                Homfli, please contact us so we can take appropriate action.
              </p>
            </div>
          ),
        },
        {
          id: "listing-accuracy",
          title: "18. Real estate listing accuracy and preview-phase notice",
          body: (
            <div className="space-y-3">
              <p>
                Homfli is currently in an early-stage development / preview
                phase.
              </p>
              <p>
                Although we aim to present useful real estate information,
                listings may be incomplete, inaccurate, outdated, duplicated,
                used for testing, or otherwise unreliable.
              </p>
              <p>
                Homfli does not verify every listing, property detail, address,
                photo, price, availability status, company profile, or agent
                claim. You should independently verify all information before
                making decisions, contacting agents, visiting properties,
                signing agreements, making payments, or entering into any
                transaction.
              </p>
              <p>
                Homfli is not a party to real estate transactions between users,
                buyers, tenants, landlords, sellers, agents, or companies.
              </p>
            </div>
          ),
        },
        {
          id: "changes",
          title: "19. Changes to this Privacy Policy",
          body: (
            <div className="space-y-3">
              <p>
                We may update this Privacy Policy from time to time, especially
                as Homfli develops, new features are added, service providers
                change, or legal requirements evolve.
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
          title: "20. Contact",
          body: (
            <div className="space-y-3">
              <p>
                For questions, requests, or concerns about this Privacy Policy
                or your personal data, contact us at:
              </p>
              <p>
                Homfli
                <br />
                Website: homfli.com
                <br />
                Email: contact@homfli.com
              </p>
            </div>
          ),
        },
      ]}
    />
  );
};

export default PrivacyPage;
