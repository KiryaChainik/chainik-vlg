"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { localeFromPathname } from "@/i18n/paths";

export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const loc = localeFromPathname(pathname);
    document.documentElement.lang = loc === "en" ? "en" : "ru";
  }, [pathname]);

  return null;
}
