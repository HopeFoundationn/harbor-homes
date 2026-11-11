import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { getPublicCatalog } from "@/lib/catalog.functions";
import { I18nProvider } from "@/lib/i18n";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: () => getPublicCatalog(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Harbor Homes" },
      { name: "theme-color", content: "#D92228" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="es" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <I18nProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <div id="contenido" className="flex-1">
                <Outlet />
              </div>
              <SiteFooter />
            </div>
          </I18nProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
