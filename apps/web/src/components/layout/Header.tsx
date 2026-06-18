"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, {
      locale: newLocale,
    });
  };

  return (
    <>
      <button onClick={() => changeLocale("ar")}>العربية</button>

      <button onClick={() => changeLocale("ur")}>اردو</button>
    </>
  );
}
