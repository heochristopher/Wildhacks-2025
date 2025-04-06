"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const languages = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("footer");

  const onSelectChange = (newLocale: string) => {
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPathname);
  };

  const currentLocale = pathname.split("/")[1];

  return (
    <footer
      aria-labelledby="footer-heading"
      className="w-full bg-green-800 text-white border-t border-green-900 py-6 px-6 font-mono relative"
    >
      <h2 id="footer-heading" className="sr-only">
        {t("footerHeading")}
      </h2>
      <div className="w-full text-center">
        <div>
          <h1 tabIndex={0} className="text-sm">{t("createdBy")}</h1>
          <a
            tabIndex={0}
            className="text-sm underline hover:text-gray-200"
            href="https://github.com/elainecui9/Wildhacks-2025"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("gitHub")}
          </a>
        </div>
      </div>
      <div className="absolute right-6 top-6">
        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => onSelectChange(e.target.value)}
          value={currentLocale}
          aria-label={t("languageSelectAriaLabel")}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </footer>
  );
}
