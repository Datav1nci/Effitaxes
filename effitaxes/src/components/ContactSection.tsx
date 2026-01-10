"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Dictionary } from "@/lib/dictionary";
import Link from "next/link";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function ContactSection({ t, isTeaser = false }: { t: Dictionary; isTeaser?: boolean }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted && !isTeaser) return null; // Teaser can be SSR? Teaser CTA is simple. But Component is client.

  if (isTeaser) {
    return (
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">{t.contact.title}</h2>
          <p className="mb-8 text-xl opacity-90">{t.hero.subtitle}</p>
          <Link href="/contact" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
            {t.nav.contact}
          </Link>
        </div>
      </section>
    )
  }

  if (!isMounted) return null; // Fallback for form mode

  return (
    <section id="contact" className="py-20 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">{t.contact.title}</h2>

        <div className="rounded-2xl bg-gray-50 p-8 sm:p-12 dark:bg-gray-950/40">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">

            {/* Form */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              {state.success ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <p className="text-xl font-medium text-gray-900 dark:text-gray-100">{t.contact.form.successTitle}</p>
                  <p className="text-gray-500 dark:text-gray-400">{t.contact.form.successMessage}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-blue-600 hover:underline text-sm"
                  >
                    {t.contact.form.sendAnother}
                  </button>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">

                  {/* Honeypot Field (Hidden) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="_gotcha">Do not fill this field</label>
                    <input type="text" id="_gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      placeholder={t.contact.form.namePlaceholder}
                    />
                    {state.errors?.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {state.errors.name[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      placeholder={t.contact.form.emailPlaceholder}
                    />
                    {state.errors?.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {state.errors.email[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contact.form.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      placeholder={t.contact.form.phonePlaceholder}
                    />
                    {state.errors?.phone && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {state.errors.phone[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.contact.form.message}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      placeholder={t.contact.form.messagePlaceholder}
                    />
                    {state.errors?.message && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {state.errors.message[0]}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.contact.form.sending}
                      </>
                    ) : (
                      t.contact.form.submit
                    )}
                  </button>

                  {state.message && !state.success && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md flex items-center gap-2">
                      <AlertCircle size={16} />
                      {state.message}
                    </div>
                  )}
                </form>
              )}
            </div>



            {/* Coordonnées + carte */}
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>{t.contact.phoneMtl} :</strong> <a href="tel:4384769456">(438) 476-9456</a>
              </p>
              <p>
                <strong>{t.contact.phoneRs}:</strong> <a href="tel:4502591829">(450) 259-1829</a>
              </p>
              <p>
                <strong>{t.contact.email} :</strong>{" "}
                <a href="mailto:youssef@effitaxes.com">youssef@effitaxes.com</a>
              </p>
              <p>
                <strong>{t.contact.address} :</strong> 004-6955 Boulevard Taschereau, Brossard, QC. J4Z 1A7
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}