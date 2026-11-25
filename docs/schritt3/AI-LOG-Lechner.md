# AI-LOG Lechner

**Verwendetes Tool:** ChatGPT (Codex)

---

### 24.11.2026 – Caching-Strategien vergleichen

**Prompt**

> Vergleiche versionierten Precache, Cache First beim ersten Abruf und Stale-While-Revalidate für unsere Konferenz-App. Was passiert jeweils, wenn jemand eine Detailseite offline zum ersten Mal öffnet? Wann wäre Stale-While-Revalidate sinnvoll?

**Zweck**

Ich wollte die Strategie anhand der Nutzung auf der Konferenz begründen und verstehen, welche Folgen sie für Personen hat, die ohne Netz zwischen Vorträgen wechseln.

**Ergebnis**

Beim Precache stehen auch zuvor ungeöffnete Detailseiten bereit, sobald der Service Worker installiert ist. Stale-While-Revalidate wäre bei kurzfristigen Raumänderungen über eine eigene Datenquelle sinnvoll. Für das statische Programm blieb es beim Precache. Die ausgewählten Session-IDs bleiben in `localStorage`.

---

### 24.11.2026 – Precache-Muster und Filter-URLs prüfen

**Prompt**

> Prüfe die Muster in vite.config.ts für die von vite-ssg erzeugten Session- und Speaker-Detailseiten. Erkläre mir ignoreURLParametersMatching anhand von /sessions?track=frontend-architecture. Bleibt der Filter beim Offline-Reload in der URL aktiv?

**Zweck**

Ich wollte erklären können, welche HTML-Dateien der Service Worker bei der Installation speichert und wie gefilterte URLs darauf zugreifen.

**Ergebnis**

`sessions/*.html` und `speakers/*.html` erfassen die Detailseiten. Beim Cache-Abgleich ignoriert Workbox `track`, `day` und `level`. Vue liest die Parameter weiterhin aus der URL und berechnet daraus die sichtbare Liste. Der abschließende Build legte 53 Einträge im Precache ab.

---

### 24.11.2026 – Den Navigations-Fallback im Cross-Review prüfen

**Prompt**

> Vergleiche Maurice’ PR mit main. Warum kann /branding offline die Überschrift der Sessionübersicht anzeigen, obwohl darunter die Fehleransicht steht? Reproduziere das Verhalten und prüfe die Korrektur.

**Zweck**

Ich wollte den im Entscheidungsprotokoll beschriebenen Fehler nachvollziehen und prüfen, wie sich der Fallback auf reguläre Seiten und unbekannte Pfade auswirkt.

**Ergebnis**

Workbox lieferte für `/branding` die vorgerenderte Startseite. Codex reproduzierte den Hydration-Fehler und passte den Einstieg so an, dass Vue bei einem abweichenden Pfad die passende Ansicht neu rendert. Beim erneuten Test erschien „Seite nicht gefunden“ ohne Hydration-Meldung. Die Korrektur steht in `c8f7c5a`.

---

### 24.11.2026 – Die drei Offline-Szenarien testen

**Prompt**

> Prüfe den Produktionsbuild in drei frischen Chrome-Kontexten. Teste den Offline-Reload mit Filter, den Erhalt meiner Programmauswahl nach einer Offline-Änderung und den Erstbesuch ohne Verbindung. Halte die tatsächlich beobachteten Ergebnisse für D fest.

**Zweck**

Ich wollte die Annahmen aus Konzept B an konkreten Aufrufen prüfen und die Ergebnisse mit Maurice’ Beobachtungen vergleichen.

**Ergebnis**

Codex führte den automatisierten Chrome-Lauf durch. Die gefilterte Übersicht zeigte vier von 20 Sessions. Nach dem Entfernen von `s02` blieben `s01` und `s17` erhalten. Beim ersten Offline-Aufruf erschien `ERR_INTERNET_DISCONNECTED`. Mein erneuter Test auf demselben Rechner ergab dieselben Ergebnisse. Im Entscheidungsprotokoll stehen meine Beobachtungen neben denen von Maurice. [Entscheidungsprotokoll](03-entscheidungsprotokoll.md)

---

### 24.11.2026 – DevTools-Nachweis und Bildunterschriften ergänzen

**Prompt**

> Erfasse für E die relevanten DevTools-Ansichten mit sichtbarer URL oder Offline-Anzeige. Ordne die Bilder den Szenarien zu und schreib jeweils einen kurzen Satz dazu, was das Bild belegt. Prüfe auch die Wortgrenze.

**Zweck**

Ich wollte, dass Maurice die Cache-Antworten, den aktiven Service Worker und den leeren Zustand beim Erstbesuch anhand der Bilder nachvollziehen kann.

**Ergebnis**

Codex erstellte neun DevTools-Aufnahmen, ordnete sie den Prüfungen zu und ergänzte die Bildunterschriften. Der ältere Lighthouse-PWA-Bericht ergänzt die Prüfung der Installierbarkeit. Die Einordnung nennt die Grenzen der Offline-Simulation, und der Text blieb innerhalb der Wortgrenze. [Verifikationsnachweis](04-verifikations-nachweis.md)
