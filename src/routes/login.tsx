import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Entrar al panel" : "Sign in to the panel";
  const lead =
    lang === "es"
      ? "Solo el administrador cambia casas, precios y textos."
      : "Only the administrator changes homes, prices, and page text.";
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16">
      <div className="w-full rounded-lg border border-line bg-surface p-6 shadow-card">
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-muted">{lead}</p>
        <div className="mt-6 grid gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                onClick={() => signIn(provider.providerId, { callbackURL: "/panel" })}
                className="press h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink"
              >
                {lang === "es" ? "Continuar con" : "Continue with"} {provider.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </main>
  );
}
