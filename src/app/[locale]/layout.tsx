import { notFound } from "next/navigation";

import { Container, Footer } from "@/components/layout";
import { Header } from "@/components/layout/Header";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { isLocale, LOCALES, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const messages = getMessages(locale);

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <Header />
      <Container className="flex-1">{children}</Container>
      <Footer />
    </LocaleProvider>
  );
}
