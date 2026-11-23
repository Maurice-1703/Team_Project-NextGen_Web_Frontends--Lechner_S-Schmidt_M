import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      // Konzept B, Abschnitt „Aktualisierung“
      // - neuer Service Worker übernimmt sofort, Seite lädt einmal neu
      // - vertretbar, weil Filter in der URL und Auswahl in localStorage liegen
      registerType: "autoUpdate",

      // Icons werden bereits über globPatterns erfasst 
      // -> vermeide Duplikate (einheitliche Anzahl an Precache-Entries: Build-Log vs. Cache Storage im Browser)
      includeManifestIcons: false,

      // Web App Manifest (Teil A)
      // - wird beim Build als dist/manifest.webmanifest erzeugt
      // - das Plugin fügt den <link rel="manifest"> automatisch in jede HTML ein
      manifest: {
        name: "CouchCoding | FrontendNow",
        short_name: "CouchCoding",
        description: "CouchCoding begleitet Teilnehmende der zweitägigen FrontendNow-Konferenz",
        lang: "de",
        // Farben: nur Hexwerte möglich, keine CSS-Variablen
        // - in der Setup-Notiz angeben, welchem Token der Wert entspricht
        theme_color: "#7a55b3",
        background_color: "#1a1420",
        display: "standalone",
        start_url: "/sessions",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      // Workbox-Einstellungen: daraus erzeugt das Plugin beim Build dist/sw.js
      workbox: {
        globPatterns: [
          // Konzept B: Statische Assets wie Icons und Favicon
          "*.{png,ico,svg}",

          // Konzept B: App-Shell und vorgerenderte Übersichtsseiten
          "*.html",
          "assets/*.{js,css}",
          "registerSW.js",      // - registriert den Service Worker, wird von jeder HTML-Seite geladen

          // Konzept B: Session- und Speaker-Details
          "sessions/*.html",
          "speakers/*.html",
        ],

        // Konzept B: Gefilterte URLs verwenden dieselbe gecachte Session-Übersicht
        // Vue liest die Filter weiterhin aus der URL
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^(track|day|level)$/],

        // Konzept B: Unbekannte URLs liefern offline die vorgerenderte index.html statt der Browser-Fehlerseite 
        // (Standardwert, hier nur sichtbar gemacht)
        navigateFallback: "index.html",
      },
    }),
  ],
})