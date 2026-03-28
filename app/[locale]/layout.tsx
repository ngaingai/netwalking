import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { isValidLocale, getDictionary, type Locale } from "@/lib/i18n";

const SITE_URL = "https://netwalking.net";

export async function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.meta.title,
      template: `%s | NetWalking`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: locale === "ja" ? SITE_URL : `${SITE_URL}/en`,
      languages: {
        ja: SITE_URL,
        en: `${SITE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NetWalking",
    url: SITE_URL,
    logo: `${SITE_URL}/images/NetWalking-Logo.jpg`,
    description:
      "NetWalking hosts bilingual community walks and networking events for globally minded families, founders, and freelancers in Tokyo.",
    sameAs: [
      "https://www.linkedin.com/company/netwalking",
      "https://x.com/_NetWalking",
      "https://www.instagram.com/_netwalking",
      "https://www.skool.com/glokyo-4028",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@netwalking.net",
        contactType: "customer support",
        areaServed: "JP",
        availableLanguage: ["en", "ja"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <div className="flex flex-col min-h-screen">
        <Header locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} dict={dict} />
      </div>
    </>
  );
}
