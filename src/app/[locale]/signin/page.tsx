"use client";
import { useRouter } from "next/navigation";
import signin from "@/app/Images/Signin.jpg";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Signin() {
  const router = useRouter();
  const t = useTranslations("auth");

  async function login(formData: FormData) {
    const body = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.status === 200) {
      router.push("/levels");
    }
  }

  return (
    <div className="flex font-mono h-screen bg-white min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 tabIndex={0} className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {t("signInTitle")}
            </h2>
            <p tabIndex={0} className="mt-2 text-sm leading-6 text-gray-500">
              {t("notMember")}{" "}
              <a
                href="/register"
                className="font-semibold text-green-900 hover:text-green-800"
              >
                {t("registerLink")}
              </a>
            </p>
          </div>

          <div className="mt-10">
            <form
              action={login}
              // method="POST"
              className="space-y-6"
              aria-labelledby="signin-form-title"
            >
              <div id="signin-form-title" className="sr-only">
                {t("signInTitle")}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t("emailLabel")}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    className="block w-full text-black p-2 rounded-md border border-gray-300 py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t("passwordLabel")}
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    className="block w-full text-black p-2 rounded-md border border-gray-300 py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900"
                  aria-label={t("signInButtonAria")}
                >
                  {t("signInButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          alt={t("signinImageAlt")}
          src={signin}
          priority
        />
      </div>
    </div>
  );
}
