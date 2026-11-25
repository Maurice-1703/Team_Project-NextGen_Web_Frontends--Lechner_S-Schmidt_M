# A – PWA-Setup

**Tooling:** Wir nutzen `vite-plugin-pwa`, das mit `vite-ssg` zusammenarbeitet und per Workbox den Service Worker erzeugt. Die Precache-Liste mit Revisionen entsteht bei jedem Build automatisch; von Hand wäre sie fehleranfällig. Registriert wird mit `registerType: 'autoUpdate'` (siehe Konzept B).

**Manifest:** Name „CouchCoding | FrontendNow“, Kurzname „CouchCoding“, `display: "standalone"`, `start_url: "/sessions"`, weil das Programm für Teilnehmende der eigentliche Einstieg ist. Icons in 64, 192 und 512 px sowie ein maskable Icon für Android, erzeugt aus unserem Logo.

**Farben:** `theme_color` `#7a55b3` entspricht `--flieder-600` (`--color-accent`). `background_color` `#1a1420` entspricht `--cocoa-950` (`--color-bg` im Dark Theme). So bleibt der Startbildschirm im abgedunkelten Saal dunkel. In `index.html` passt `theme-color` die Browserleiste mit `prefers-color-scheme` an die Systemeinstellung für Hell und Dunkel an.
