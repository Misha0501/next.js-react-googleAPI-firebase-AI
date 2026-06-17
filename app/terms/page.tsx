import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/components/legal/LegalPage";
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl";

const title = "Terms of Service — Homfli";
const description = "Terms of service for using the Homfli platform.";
const lastUpdated = "17 June 2026";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
};

const TermsPage = () => {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={lastUpdated}
      intro={`Welcome to Homfli. These Terms of Service ("Terms") govern your access to and use of the Homfli website and platform available at homfli.com ("Homfli", the "Platform", "we", "us", or "our"). By accessing or using Homfli, you agree to these Terms. If you do not agree to these Terms, you should not use the Platform. Homfli is a Bulgarian real estate marketplace for browsing, buying, renting, saving, and managing property listings. The Platform is currently in an early-stage development / preview phase. This means that some features may be incomplete, experimental, unavailable, inaccurate, or subject to change. You should not rely on Homfli as the only source of information for actual real estate decisions or transactions.`}
      sections={[
        {
          id: "operator",
          title: "1. Who operates Homfli",
          body: (
            <div className="space-y-3">
              <p>
                Homfli is currently operated by an individual platform owner.
                <br />
                <br />
                Public business address: Not currently listed. Please contact us
                by email for legal or platform-related requests.
                <br />
                <br />
                Website: homfli.com
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
                References to &ldquo;Homfli&rdquo;, &ldquo;we&rdquo;,
                &ldquo;us&rdquo;, or &ldquo;our&rdquo; mean the individual
                platform owner currently operating Homfli. If Homfli is
                incorporated as a legal entity in the future, these Terms will
                be updated accordingly.
              </p>
            </div>
          ),
        },
        {
          id: "what-homfli-does",
          title: "2. What Homfli does",
          body: (
            <div className="space-y-3">
              <p>
                Homfli provides an online marketplace where users can browse
                property listings and where authorised users, companies, and
                real estate agents may create and manage listings.
              </p>
              <p>The Platform may include features such as:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Browsing property listings</li>
                <li>Searching and filtering listings</li>
                <li>Viewing property details and photos</li>
                <li>Creating a user account</li>
                <li>Saving listings</li>
                <li>Saving searches</li>
                <li>Viewing recently viewed listings</li>
                <li>Creating and managing company profiles</li>
                <li>Inviting company members</li>
                <li>Creating and managing property listings</li>
                <li>Receiving saved-search notifications, where enabled</li>
                <li>Contacting Homfli through a contact form</li>
                <li>
                  Subscription or invoice-related functionality, where enabled
                </li>
              </ul>
              <p>
                Some features may be disabled, incomplete, experimental, or
                available only to certain users.
              </p>
            </div>
          ),
        },
        {
          id: "preview-phase",
          title: "3. Preview-phase disclaimer",
          body: (
            <div className="space-y-3">
              <p>
                Homfli is currently in an early-stage development / preview
                phase.
              </p>
              <p>
                Although the Platform may look and function like a real real
                estate marketplace, you understand and agree that:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Homfli may contain test data, incomplete data, outdated data,
                  or inaccurate data.
                </li>
                <li>
                  Some listings may be created for testing, demonstration, or
                  development purposes.
                </li>
                <li>
                  Features may change, break, be removed, or become unavailable
                  without notice.
                </li>
                <li>
                  Saved listings, saved searches, recently viewed listings,
                  notifications, company profiles, invoices, subscriptions, and
                  other records may not always work as expected.
                </li>
                <li>
                  Homfli should not be relied on as the sole basis for buying,
                  renting, selling, leasing, visiting, financing, or otherwise
                  transacting in real estate.
                </li>
              </ul>
              <p>
                Before making any real estate decision, you must independently
                verify all relevant information with the property owner,
                landlord, seller, buyer, tenant, agent, agency, municipality,
                notary, legal adviser, or other appropriate professional.
              </p>
            </div>
          ),
        },
        {
          id: "not-a-party",
          title: "4. Homfli is not a party to real estate transactions",
          body: (
            <div className="space-y-3">
              <p>
                Homfli provides a platform for displaying and discovering
                property listings.
              </p>
              <p>
                Homfli is not a real estate agent, broker, landlord, seller,
                buyer, tenant, notary, legal adviser, financial adviser,
                mortgage adviser, or property manager.
              </p>
              <p>
                Unless explicitly stated otherwise in writing, Homfli is not a
                party to any transaction, agreement, negotiation, viewing,
                lease, sale, purchase, reservation, payment, deposit, agency
                relationship, or other arrangement between users.
              </p>
              <p>
                Any transaction or communication between users, agents,
                companies, landlords, sellers, buyers, or tenants is solely
                between those parties.
              </p>
              <p>
                Homfli does not guarantee that any transaction will be
                completed, that any user is trustworthy, or that any property is
                available, lawful, safe, suitable, correctly described, or
                priced accurately.
              </p>
            </div>
          ),
        },
        {
          id: "listing-accuracy",
          title: "5. Listing accuracy and property information",
          body: (
            <div className="space-y-3">
              <p>
                Property listings may include information such as price,
                currency, address, location, photos, property type, number of
                rooms, floor area, year built, condition, heating type, parking,
                descriptions, key points, and availability status.
              </p>
              <p>
                Homfli does not guarantee the accuracy, completeness, legality,
                availability, or reliability of any listing or property
                information.
              </p>
              <p>
                Listings may be created or managed by third-party users,
                agencies, companies, or agents. Those parties are responsible
                for ensuring that the information they provide is accurate,
                lawful, up to date, and not misleading.
              </p>
              <p>You understand and agree that:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Prices may be wrong or outdated.</li>
                <li>
                  Availability may change without being updated on Homfli.
                </li>
                <li>
                  Photos may not fully or accurately represent the property.
                </li>
                <li>
                  Map locations, latitude/longitude coordinates, addresses, and
                  neighbourhood information may be approximate or incorrect.
                </li>
                <li>Property measurements may be inaccurate.</li>
                <li>
                  Descriptions may contain mistakes, exaggerations, omissions,
                  or AI-generated text.
                </li>
                <li>
                  Listings may remain visible after a property is no longer
                  available.
                </li>
              </ul>
              <p>
                You must verify all listing details independently before making
                decisions.
              </p>
            </div>
          ),
        },
        {
          id: "user-accounts",
          title: "6. User accounts",
          body: (
            <div className="space-y-3">
              <p>Some features require an account.</p>
              <p>When creating or using an account, you agree to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Provide accurate and current information.</li>
                <li>Keep your login details secure.</li>
                <li>Not share your account with unauthorised persons.</li>
                <li>Notify us if you suspect unauthorised access.</li>
                <li>Be responsible for all activity under your account.</li>
              </ul>
              <p>
                We may refuse, suspend, restrict, or terminate accounts where we
                believe there has been misuse, unauthorised activity, false
                information, fraud, spam, unlawful conduct, or breach of these
                Terms.
              </p>
              <p>
                Authentication may be handled through Firebase Authentication
                and supported login methods may include email/password login and
                Google Sign-In.
              </p>
            </div>
          ),
        },
        {
          id: "company-accounts",
          title: "7. Company accounts and agency access",
          body: (
            <div className="space-y-3">
              <p>
                Homfli may allow companies, agencies, or authorised users to
                create and manage company profiles and property listings.
              </p>
              <p>
                Company membership may be invitation-based. A company member may
                be assigned a role that determines what they can access or
                manage.
              </p>
              <p>
                If you create, manage, or join a company profile, you confirm
                that:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  You have permission to act on behalf of that company or
                  agency.
                </li>
                <li>
                  The company information you provide is accurate and lawful.
                </li>
                <li>
                  You will not falsely represent your relationship with a
                  company, agency, owner, landlord, seller, or property.
                </li>
                <li>You will keep company and listing data up to date.</li>
                <li>
                  You will remove or update listings that are no longer
                  available or accurate.
                </li>
              </ul>
              <p>
                Homfli may suspend or remove company access if we believe the
                company profile or its listings are false, misleading, unlawful,
                unauthorised, harmful, or in breach of these Terms.
              </p>
            </div>
          ),
        },
        {
          id: "user-content",
          title: "8. User content",
          body: (
            <div className="space-y-3">
              <p>
                &ldquo;User Content&rdquo; means any content submitted,
                uploaded, created, or provided through Homfli, including:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Property listings</li>
                <li>Property descriptions</li>
                <li>Key points</li>
                <li>Photos</li>
                <li>Company profiles</li>
                <li>Contact information</li>
                <li>Saved search criteria</li>
                <li>Messages submitted through forms</li>
                <li>Any other content submitted to the Platform</li>
              </ul>
              <p>You are responsible for your User Content.</p>
              <p>You must ensure that your User Content:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Is accurate and not misleading.</li>
                <li>Does not infringe intellectual property rights.</li>
                <li>
                  Does not violate privacy, data protection, or confidentiality
                  rights.
                </li>
                <li>
                  Does not contain unlawful, discriminatory, abusive,
                  fraudulent, or harmful material.
                </li>
                <li>
                  Does not contain malware, spam, scams, or deceptive content.
                </li>
                <li>
                  Does not falsely suggest approval, certification,
                  availability, ownership, or authorisation.
                </li>
                <li>Complies with applicable Bulgarian and EU law.</li>
              </ul>
              <p>
                You must not upload property photos, descriptions, addresses,
                personal data, company data, or other content unless you have
                the right to do so.
              </p>
            </div>
          ),
        },
        {
          id: "content-licence",
          title: "9. Licence to use User Content",
          body: (
            <div className="space-y-3">
              <p>You retain ownership of the content you submit to Homfli.</p>
              <p>
                By submitting User Content to the Platform, you grant Homfli a
                non-exclusive, worldwide, royalty-free licence to host, store,
                copy, display, publish, transmit, format, modify for technical
                purposes, and otherwise use that content as necessary to
                operate, develop, promote, and improve the Platform.
              </p>
              <p>This licence allows us, for example, to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Display property listings to users.</li>
                <li>Store listing photos.</li>
                <li>Resize or optimise images.</li>
                <li>Show listing previews.</li>
                <li>Send saved-search notification emails where enabled.</li>
                <li>Display company profile information.</li>
                <li>Maintain backups and technical records.</li>
              </ul>
              <p>
                You confirm that you have all rights necessary to grant this
                licence.
              </p>
            </div>
          ),
        },
        {
          id: "prohibited-use",
          title: "10. Prohibited use",
          body: (
            <div className="space-y-3">
              <p>You must not use Homfli to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Break any applicable law or regulation.</li>
                <li>
                  Post false, fake, misleading, fraudulent, or deceptive
                  listings.
                </li>
                <li>
                  Impersonate another person, company, agency, landlord, seller,
                  buyer, tenant, or agent.
                </li>
                <li>Upload content you do not have permission to use.</li>
                <li>
                  Collect, scrape, copy, or harvest data from the Platform
                  without permission.
                </li>
                <li>
                  Interfere with the security or operation of the Platform.
                </li>
                <li>
                  Attempt to bypass authentication, rate limits, or access
                  controls.
                </li>
                <li>
                  Use automated bots, crawlers, or scripts without permission.
                </li>
                <li>
                  Send spam, phishing messages, scams, or harmful content.
                </li>
                <li>Upload malware or malicious code.</li>
                <li>
                  Discriminate unlawfully in relation to housing or property
                  access.
                </li>
                <li>
                  Use Homfli for money laundering, fraud, illegal payments, or
                  other unlawful transactions.
                </li>
                <li>
                  Misrepresent property ownership, availability, location,
                  condition, price, or legal status.
                </li>
                <li>
                  Use Homfli in a way that harms users, companies, agents,
                  property owners, or the Platform.
                </li>
              </ul>
              <p>
                We may investigate and take action if we believe these rules
                have been violated.
              </p>
            </div>
          ),
        },
        {
          id: "moderation",
          title: "11. Moderation, removal, and suspension",
          body: (
            <div className="space-y-3">
              <p>
                We may review, moderate, restrict, remove, or disable access to
                content, listings, company profiles, accounts, or features where
                we believe that:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>These Terms have been breached.</li>
                <li>
                  Content is unlawful, misleading, fraudulent, harmful, or
                  inaccurate.
                </li>
                <li>
                  A listing may be fake, unavailable, unauthorised, or
                  deceptive.
                </li>
                <li>A user or company may be misusing the Platform.</li>
                <li>
                  We are required to do so by law, court order, authority
                  request, or platform provider policy.
                </li>
                <li>
                  The content or activity may create risk for Homfli, users, or
                  third parties.
                </li>
              </ul>
              <p>
                We may also suspend or terminate accounts, company access, or
                listing privileges.
              </p>
              <p>
                Where required by applicable law, we may provide information
                about moderation decisions, reporting channels, or appeal
                options.
              </p>
            </div>
          ),
        },
        {
          id: "reporting",
          title: "12. Reporting illegal or inaccurate content",
          body: (
            <div className="space-y-3">
              <p>
                If you believe a listing, company profile, account, or other
                content on Homfli is illegal, inaccurate, misleading,
                fraudulent, unauthorised, or violates these Terms, you can
                contact us at:
              </p>
              <p>contact@homfli.com</p>
              <p>Please include:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The URL or title of the listing or content.</li>
                <li>The reason for your report.</li>
                <li>Any supporting information.</li>
                <li>Your contact details, if you want us to follow up.</li>
              </ul>
              <p>
                We may review the report and take action where appropriate. We
                do not guarantee that every reported item will be removed.
              </p>
            </div>
          ),
        },
        {
          id: "saved-features",
          title:
            "13. Saved listings, saved searches, and recently viewed listings",
          body: (
            <div className="space-y-3">
              <p>
                Logged-in users may be able to save listings, save searches, and
                view recently viewed listings.
              </p>
              <p>These features are provided for convenience only.</p>
              <p>We do not guarantee that:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Saved listings will remain available.</li>
                <li>
                  Saved search filters will always return accurate or complete
                  results.
                </li>
                <li>Notification emails will always be sent.</li>
                <li>
                  Recently viewed listings will always be available or accurate.
                </li>
                <li>Matching logic will be error-free.</li>
              </ul>
              <p>
                You are responsible for independently checking whether a
                property is still available and whether the information is
                correct.
              </p>
            </div>
          ),
        },
        {
          id: "notifications",
          title: "14. Notifications and emails",
          body: (
            <div className="space-y-3">
              <p>
                Homfli may send transactional or service-related emails, such
                as:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Account-related emails</li>
                <li>Company invitation emails</li>
                <li>Contact form forwarding</li>
                <li>Saved-search match notifications, where enabled</li>
                <li>Subscription or invoice-related emails, where enabled</li>
                <li>Important service or legal notices</li>
              </ul>
              <p>
                Saved-search notification functionality may be disabled,
                incomplete, or experimental during the preview phase.
              </p>
              <p>
                You are responsible for ensuring that your email address is
                correct and that Homfli emails are not blocked by your email
                provider.
              </p>
            </div>
          ),
        },
        {
          id: "subscriptions",
          title: "15. Subscriptions, invoices, and paid features",
          body: (
            <div className="space-y-3">
              <p>
                Homfli may include subscription, invoice, or paid-feature
                functionality.
              </p>
              <p>
                Unless stated otherwise, any pricing, plan, subscription,
                invoice, or payment-related feature shown during the early-stage
                development / preview phase may be experimental, incomplete, or
                subject to change.
              </p>
              <p>
                If paid services are introduced, additional payment terms may
                apply.
              </p>
              <p>
                Homfli does not currently appear to process payment card data
                directly. If payment functionality is added later, these Terms
                and related policies may be updated.
              </p>
            </div>
          ),
        },
        {
          id: "third-party-services",
          title: "16. Third-party services",
          body: (
            <div className="space-y-3">
              <p>
                Homfli uses third-party services to operate the Platform. These
                may include:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Firebase Authentication</li>
                <li>Firebase Storage / Google Cloud Storage</li>
                <li>Google Maps / Places API</li>
                <li>Resend</li>
                <li>Vercel</li>
                <li>Redis</li>
                <li>PostgreSQL database hosting providers</li>
                <li>OpenAI, if AI description functionality is enabled</li>
              </ul>
              <p>
                Third-party services may have their own terms, privacy policies,
                availability limits, technical restrictions, and data-processing
                practices.
              </p>
              <p>
                We are not responsible for third-party service outages, errors,
                policy changes, or actions outside our control.
              </p>
            </div>
          ),
        },
        {
          id: "google-maps",
          title: "17. Google Maps and address features",
          body: (
            <div className="space-y-3">
              <p>
                Homfli may use Google Maps / Places API for address
                autocomplete, property location, and search features.
              </p>
              <p>
                Address results, map coordinates, neighbourhood suggestions, or
                location data may be approximate or incorrect.
              </p>
              <p>
                You must independently verify property addresses and locations
                before making decisions or visiting a property.
              </p>
              <p>
                Use of Google-powered features may also be subject to
                Google&apos;s own terms and policies.
              </p>
            </div>
          ),
        },
        {
          id: "ai-content",
          title: "18. AI-generated content",
          body: (
            <div className="space-y-3">
              <p>
                Homfli may include AI-assisted functionality, such as generating
                or improving property descriptions.
              </p>
              <p>
                At the current stage, the AI description feature is disabled. If
                it is re-enabled, output may be inaccurate, incomplete, generic,
                or misleading.
              </p>
              <p>
                You are responsible for reviewing, correcting, and verifying any
                AI-generated content before publishing it.
              </p>
              <p>
                You must not submit sensitive personal data, confidential data,
                unlawful content, or third-party content you are not authorised
                to use into AI tools on Homfli.
              </p>
              <p>
                Homfli does not guarantee the accuracy, legality, quality, or
                suitability of AI-generated output.
              </p>
            </div>
          ),
        },
        {
          id: "intellectual-property",
          title: "19. Intellectual property",
          body: (
            <div className="space-y-3">
              <p>
                The Homfli Platform, including its design, branding, layout,
                software, database structure, user interface, logos, text,
                graphics, and other materials, is owned by Homfli or its
                licensors, unless stated otherwise.
              </p>
              <p>
                You may not copy, reproduce, distribute, modify, reverse
                engineer, scrape, or commercially exploit any part of the
                Platform without our prior written permission, except where
                allowed by law.
              </p>
              <p>
                User Content remains owned by the person or entity that
                submitted it, subject to the licence granted to Homfli under
                these Terms.
              </p>
            </div>
          ),
        },
        {
          id: "privacy",
          title: "20. Privacy",
          body: (
            <div className="space-y-3">
              <p>
                Your use of Homfli is also governed by our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#1F5FD6] hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/cookies"
                  className="font-semibold text-[#1F5FD6] hover:underline"
                >
                  Cookie Policy
                </Link>
                .
              </p>
              <p>
                The Privacy Policy explains how we collect, use, store, and
                protect personal data.
              </p>
              <p>
                The Cookie Policy explains which cookies and similar
                technologies are used on the Platform.
              </p>
            </div>
          ),
        },
        {
          id: "availability",
          title: "21. Availability and changes to the Platform",
          body: (
            <div className="space-y-3">
              <p>
                Homfli is provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis.
              </p>
              <p>We do not guarantee that:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The Platform will always be available.</li>
                <li>The Platform will be error-free.</li>
                <li>Listings will always be accessible.</li>
                <li>Account features will always work.</li>
                <li>Emails or notifications will always be delivered.</li>
                <li>Search results will always be accurate.</li>
                <li>Data will never be lost.</li>
                <li>Bugs or security issues will never occur.</li>
              </ul>
              <p>
                We may update, modify, suspend, restrict, replace, or
                discontinue any part of the Platform at any time.
              </p>
              <p>
                During the preview phase, changes may happen frequently and
                without prior notice.
              </p>
            </div>
          ),
        },
        {
          id: "no-professional-advice",
          title: "22. No professional advice",
          body: (
            <div className="space-y-3">
              <p>
                Information on Homfli is provided for general informational and
                marketplace purposes only.
              </p>
              <p>Homfli does not provide:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Legal advice</li>
                <li>Real estate advice</li>
                <li>Financial advice</li>
                <li>Tax advice</li>
                <li>Mortgage advice</li>
                <li>Construction or technical property advice</li>
                <li>Investment advice</li>
              </ul>
              <p>
                You should consult qualified professionals before making
                decisions involving real estate, contracts, financing, tax,
                legal obligations, or property condition.
              </p>
            </div>
          ),
        },
        {
          id: "consumer-rights",
          title: "23. Consumer rights",
          body: (
            <div className="space-y-3">
              <p>
                Nothing in these Terms limits rights that you may have under
                mandatory consumer protection laws.
              </p>
              <p>
                If you are a consumer in the European Union, you may have
                mandatory legal rights that cannot be excluded by contract.
              </p>
              <p>
                Where Homfli introduces paid services, subscriptions, or digital
                services for consumers, additional consumer-rights information
                may apply, including information about cancellation rights,
                withdrawal rights, pricing, renewal, and complaint handling
                where required by law.
              </p>
            </div>
          ),
        },
        {
          id: "liability",
          title: "24. Limitation of liability",
          body: (
            <div className="space-y-3">
              <p>
                To the maximum extent permitted by applicable law, Homfli is not
                liable for:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Inaccurate, incomplete, outdated, fake, or misleading
                  listings.
                </li>
                <li>Property unavailability.</li>
                <li>
                  Incorrect prices, addresses, photos, dimensions, descriptions,
                  or availability status.
                </li>
                <li>Losses arising from reliance on listing information.</li>
                <li>
                  Transactions, negotiations, agreements, viewings, payments,
                  deposits, or disputes between users.
                </li>
                <li>
                  Conduct of agents, companies, sellers, landlords, buyers,
                  tenants, or other third parties.
                </li>
                <li>
                  Loss of data, saved listings, saved searches, recently viewed
                  listings, or account access.
                </li>
                <li>
                  Service interruptions, technical errors, bugs, delays, or
                  security incidents.
                </li>
                <li>Third-party service failures.</li>
                <li>
                  Indirect, incidental, special, consequential, or punitive
                  damages.
                </li>
                <li>
                  Loss of profit, revenue, business opportunity, goodwill, or
                  expected savings.
                </li>
              </ul>
              <p>
                Homfli&apos;s total liability for any claim relating to the
                Platform is limited to the greater of:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  The amount you paid to Homfli for the relevant service in the
                  three months before the claim; or
                </li>
                <li>EUR 50.</li>
              </ul>
              <p>
                This limitation does not exclude liability that cannot be
                excluded or limited under applicable law, such as liability for
                intentional misconduct or mandatory consumer rights.
              </p>
            </div>
          ),
        },
        {
          id: "indemnity",
          title: "25. Indemnity",
          body: (
            <div className="space-y-3">
              <p>
                If you use Homfli on behalf of a company, agency, or
                professional real estate business, you agree to indemnify and
                hold Homfli harmless from claims, losses, damages, liabilities,
                costs, and expenses arising from:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Your listings or User Content.</li>
                <li>Your breach of these Terms.</li>
                <li>Your violation of law.</li>
                <li>Your infringement of third-party rights.</li>
                <li>
                  Your real estate transactions, communications, or disputes.
                </li>
                <li>Your misuse of the Platform.</li>
                <li>
                  Your unauthorised use of company, property, or personal data.
                </li>
              </ul>
              <p>
                This section applies to the extent permitted by applicable law.
              </p>
            </div>
          ),
        },
        {
          id: "termination",
          title: "26. Termination",
          body: (
            <div className="space-y-3">
              <p>You may stop using Homfli at any time.</p>
              <p>
                We may suspend, restrict, or terminate your access to Homfli if:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>You breach these Terms.</li>
                <li>You misuse the Platform.</li>
                <li>
                  You provide false, misleading, unlawful, or harmful content.
                </li>
                <li>We are required to do so by law.</li>
                <li>
                  Your activity creates risk for Homfli, users, third parties,
                  or service providers.
                </li>
                <li>We discontinue the Platform or relevant features.</li>
              </ul>
              <p>
                Termination does not automatically delete all data. Data
                retention is explained in the{" "}
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
        {
          id: "governing-law",
          title: "27. Governing law",
          body: (
            <div className="space-y-3">
              <p>
                These Terms are governed by the laws of Bulgaria, unless
                mandatory consumer protection laws require otherwise.
              </p>
              <p>
                If you are a consumer resident in the European Union, you may
                also benefit from mandatory protections of the country where you
                live.
              </p>
            </div>
          ),
        },
        {
          id: "disputes",
          title: "28. Disputes",
          body: (
            <div className="space-y-3">
              <p>
                If you have a complaint or dispute, please contact us first at:
              </p>
              <p>contact@homfli.com</p>
              <p>We will try to resolve the issue informally where possible.</p>
              <p>
                If a dispute cannot be resolved informally, it may be handled by
                the competent courts of Bulgaria, unless mandatory law provides
                otherwise.
              </p>
              <p>
                Consumers in the EU may also have access to alternative dispute
                resolution mechanisms, which allow consumers and traders to
                resolve disputes without going to court.
              </p>
            </div>
          ),
        },
        {
          id: "changes",
          title: "29. Changes to these Terms",
          body: (
            <div className="space-y-3">
              <p>We may update these Terms from time to time.</p>
              <p>
                The updated version will be posted on this page with a new
                &ldquo;Last updated&rdquo; date.
              </p>
              <p>
                If changes are material, we may provide additional notice where
                appropriate.
              </p>
              <p>
                By continuing to use Homfli after changes take effect, you agree
                to the updated Terms.
              </p>
            </div>
          ),
        },
        {
          id: "contact",
          title: "30. Contact",
          body: (
            <div className="space-y-3">
              <p>For questions about these Terms, contact us at:</p>
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

export default TermsPage;
