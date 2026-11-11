import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/renting")({ component: RentingPage });

function RentingPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t.rentingTitle;
  }, [t.rentingTitle]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-ink">{t.rentingTitle}</h1>
      <p className="mt-3 text-lg text-muted">{t.rentingLead}</p>
      <ol className="mt-8 grid gap-4">
        {t.steps.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-line bg-surface p-5">
            <p className="text-sm font-semibold tabular-nums text-primary">0{index + 1}</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{step.title}</h2>
            <p className="mt-2 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-10 text-2xl font-semibold text-ink">{t.reqTitle}</h2>
      <ul className="mt-4 grid gap-2">
        {t.reqs.map((item) => (
          <li key={item} className="rounded-md border border-line bg-surface px-4 py-3 text-ink">
            {item}
          </li>
        ))}
      </ul>
      <Link
        to="/search"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-on-primary"
      >
        {t.browse}
      </Link>
    </main>
  );
}
