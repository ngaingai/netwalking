"use client";

import { useState } from "react";

import type { Locale } from "@/lib/i18n";

// Posts to the Hashi contacts master (hashi.jp, WEB-019). The label is stored
// with each sign-up as the words the person agreed to: change it here and in
// Hashi-jp src/lib/contacts.ts WORDING.netwalkingUpdates* together.
const ENDPOINT = "https://hashi.jp/api/netwalking/subscribe";

export interface EmailSignupDict {
  label: string;
  placeholder: string;
  button: string;
  sending: string;
  done: string;
  error: string;
}

type State = "idle" | "sending" | "done" | "error";

export function EmailSignup({ locale, t, walk }: { locale: Locale; t: EmailSignupDict; walk?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale, walk, website }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p role="status" className="text-sm font-semibold text-green">{t.done}</p>;
  }

  return (
    <form onSubmit={submit} className="max-w-md">
      <label htmlFor="nw-email" className="block text-sm font-semibold text-white">
        {t.label}
      </label>
      {/* Honeypot. Hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />
      <div className="mt-2 flex gap-2">
        <input
          id="nw-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          className="min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 text-base text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-green"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="shrink-0 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
        >
          {state === "sending" ? t.sending : t.button}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-white/80">{t.error}</p>
      )}
    </form>
  );
}
