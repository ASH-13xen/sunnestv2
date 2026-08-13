/**
 * Single source of truth for the business facts that search engines read.
 * Consumed by app/layout.tsx (metadata + JSON-LD), app/robots.ts and
 * app/sitemap.ts, so the canonical URL is only ever defined once.
 *
 * Keep the phone, address and name here byte-identical to what the UI renders.
 * Local search ranking leans on NAP (name/address/phone) consistency, so a
 * mismatch between the markup and the visible page actively hurts.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunnestpower.com";

export const SITE_NAME = "SunNest Power";
export const LEGAL_NAME = "SunNest Power LLP";
export const TAGLINE = "Turning Sunlight Into Savings";

export const SITE_DESCRIPTION =
  "SunNest Power designs, permits, and commissions high-yield solar systems across India — residential rooftops to industrial captive plants. Turning sunlight into savings.";

export const PHONE = "+91-9109102662";
export const EMAIL = "sales@sunnestpower.com";

export const ADDRESS = {
  street: "A-09/10 Mahavir Gaushala Complex, Moudhapara Road",
  locality: "Raipur",
  region: "Chhattisgarh",
  country: "IN",
} as const;

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/sunnestpower",
  "https://www.linkedin.com/company/sunnest-power/",
  "https://www.facebook.com/share/161aZ8ZhACb/",
];

/**
 * Schema.org graph describing the business. `LocalBusiness` is a subtype of
 * `Organization`, so this single node carries both the `logo` that Google's
 * logo rich result reads and the address/hours that a "<brand> <city>" search
 * looks for.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        slogan: TAGLINE,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo-schema.png`,
          contentUrl: `${SITE_URL}/logo-schema.png`,
          width: 512,
          height: 512,
          caption: `${SITE_NAME} logo`,
        },
        image: { "@id": `${SITE_URL}/#logo` },
        telephone: PHONE,
        email: EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          addressLocality: ADDRESS.locality,
          addressRegion: ADDRESS.region,
          addressCountry: ADDRESS.country,
        },
        areaServed: { "@type": "Country", name: "India" },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        sameAs: SOCIAL_PROFILES,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };
}
