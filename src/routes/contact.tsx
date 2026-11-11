import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { useEffect } from "react";
import { useContactInfo } from "@/lib/catalog";
import { TourForm } from "@/components/tour-form";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const { t } = useI18n();
  const contact = useContactInfo();

  useEffect(() => {
    document.title = t.contactTitle;
  }, [t.contactTitle]);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <h1 className="text-3xl font-semibold text-ink">{t.contactTitle}</h1>
        <p className="mt-3 max-w-xl text-lg text-muted">{t.contactLead}</p>
        <div className="mt-8 grid gap-3">
          <a href={contact.phoneHref} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 text-ink">
            <Phone className="size-5 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted">{t.phoneLabel}</span>
              {contact.phone}
            </span>
          </a>
          <a href={contact.emailHref} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 text-ink">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted">{t.emailLabel}</span>
              {contact.email}
            </span>
          </a>
        </div>
        <p className="mt-4 text-sm text-muted">{contact.hours}</p>
        <p className="mt-2 text-sm text-muted">{t.note}</p>
      </div>
      <TourForm />
    </main>
  );
}
