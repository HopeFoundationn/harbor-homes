import { useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const field =
  "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-base text-ink outline-none focus:border-primary";

export function TourForm() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  if (sent) {
    return (
      <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
        <span className="inline-flex size-10 items-center justify-center rounded-md bg-chip text-primary">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 text-xl font-semibold text-ink">{t.sentTitle}</h2>
        <p className="mt-2 text-sm text-muted">{t.sentBody}</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-lg border border-line bg-surface p-5 shadow-card"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const next: typeof errors = {};
        if (name.length < 2) next.name = t.errName;
        if (phone.replace(/\D/g, "").length < 7) next.phone = t.errPhone;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.errEmail;
        setErrors(next);
        if (Object.keys(next).length === 0) setSent(true);
      }}
    >
      <h2 className="text-xl font-semibold text-ink">{t.tourTitle}</h2>
      <p className="mt-1 text-sm text-muted">{t.tourLead}</p>
      <label className="mt-4 block text-sm font-semibold text-ink">
        {t.name}
        <input name="name" autoComplete="name" className={field} />
        {errors.name ? <span className="mt-1 block font-medium text-primary">{errors.name}</span> : null}
      </label>
      <label className="mt-3 block text-sm font-semibold text-ink">
        {t.phone}
        <input name="phone" type="tel" autoComplete="tel" className={field} />
        {errors.phone ? <span className="mt-1 block font-medium text-primary">{errors.phone}</span> : null}
      </label>
      <label className="mt-3 block text-sm font-semibold text-ink">
        {t.email}
        <input name="email" type="email" autoComplete="email" className={field} />
        {errors.email ? <span className="mt-1 block font-medium text-primary">{errors.email}</span> : null}
      </label>
      <label className="mt-3 block text-sm font-semibold text-ink">
        {t.move}
        <input name="move" type="date" className={field} />
      </label>
      <label className="mt-3 block text-sm font-semibold text-ink">
        {t.message}
        <textarea
          name="message"
          rows={3}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-base text-ink outline-none focus:border-primary"
        />
      </label>
      <button type="submit" className="mt-4 h-11 w-full rounded-md bg-primary text-base font-semibold text-on-primary">
        {t.send}
      </button>
    </form>
  );
}
