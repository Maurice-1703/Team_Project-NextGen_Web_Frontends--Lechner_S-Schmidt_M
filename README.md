# CouchCoding

CouchCoding ist unsere Konferenzplattform für die fiktive Frontend-Konferenz „FrontendNow“.

Aktuell enthält das Projekt das Grundgerüst aus Schritt 1: Branding, Design-Tokens, Navigation, Platzhalterseiten und das Einlesen des vorgegebenen Konferenzdatensatzes.

## Voraussetzungen

Empfohlene Entwicklungsumgebung:

- Node.js **24.22.0 LTS**
- npm **11.19.1**

Node.js 24 erfüllt die Anforderungen der verwendeten Abhängigkeiten. Informationen zu den unterstützten Versionen stehen in der [Node.js-Releaseübersicht](https://nodejs.org/en/about/previous-releases).

Die installierten Versionen lassen sich so prüfen:

```bash
node --version
npm --version
```

## Installation

Alle folgenden Befehle im Projektordner ausführen, in dem die `package.json` liegt.

Abhängigkeiten installieren:

```bash
npm install
```

Bei einem frisch geklonten Repository kann alternativ `npm ci` verwendet werden. Dabei werden die Paketversionen aus der vorhandenen `package-lock.json` installiert.

## Anwendung starten

```bash
npm run dev
```

Anschließend die im Terminal angezeigte Adresse im Browser öffnen. Standardmäßig ist das [http://localhost:5173](http://localhost:5173).

Der Entwicklungsserver bleibt während der Arbeit geöffnet. Gespeicherte Änderungen werden automatisch übernommen. Mit `Strg+C` wird der Server beendet.

Unter Windows PowerShell können die Befehle mit `npm.cmd` ausgeführt werden, beispielsweise:

```powershell
npm.cmd run dev
```

## Build und lokale Vorschau

TypeScript-Prüfung und Build ausführen:

```bash
npm run build
```

Der Build wird im Ordner `dist/` erzeugt.

Den gebauten Stand anschließend lokal ansehen:

```bash
npm run preview
```

Die Vorschau ist normalerweise unter [http://localhost:4173](http://localhost:4173) erreichbar. Maßgeblich ist die Adresse im Terminal. Weitere Informationen enthält die [Vite-Dokumentation zu Build und Vorschau](https://vite.dev/guide/static-deploy.html).

## Technisches Setup

- Vue 3 mit Composition API und `<script setup>`
- TypeScript
- Vite als Entwicklungsserver und Build-Werkzeug
- Vue Router für die Navigation
- CSS Custom Properties für die Design-Tokens

Die Anwendung benötigt kein eigenes Backend und keinen Login.

## Aktueller Funktionsumfang

- Gemeinsamer Seitenrahmen mit CouchCoding-Branding und Navigation
- Eingebundene Design-Tokens und globale Styles
- Schreibgeschützter Zugriff auf die Konferenzdaten über `useConferenceData()`
- Anzeige der 20 Sessions als Nachweis, dass der Datensatz eingelesen wird
- Platzhalter für Übersichten, Detailseiten und „Mein Couch-Programm“
- Fehlerseite für unbekannte URL-Pfade

Die Detailseiten zeigen bisher nur die übergebene ID. Die zugehörigen Daten und die Prüfung auf gültige IDs werden später ergänzt.

## Routen

| Adresse | Inhalt |
| --- | --- |
| `/` | Weiterleitung zu `/sessions` |
| `/sessions` | Sessionübersicht mit Anzahl der Sessions |
| `/sessions/:id` | Platzhalter für eine Session-Detailseite |
| `/speakers` | Platzhalter für die Speakerübersicht |
| `/speakers/:id` | Platzhalter für ein Speakerprofil |
| `/my-program` | Platzhalter für „Mein Couch-Programm“ |
| Sonstige Pfade | Fehlerseite |

Beispiele für Detailrouten sind `/sessions/s02` und `/speakers/sp01`.

## Projektstruktur

```text
docs/schritt1/        Konzepte und Architekturentscheidungen
tokens/              Design-Tokens
src/
  assets/data/       Vorgegebener Konferenzdatensatz
  components/
    base/            Allgemeine UI-Bausteine
    feature/         Komponenten mit Konferenzbezug
    layout/          Seitenrahmen, Header und Navigation
  composables/       Wiederverwendbare Logik und Datenzugriff
  router/            Routenkonfiguration
  stores/            Persönlicher Programmzustand
  styles/            Globale Styles
  types/             TypeScript-Datenmodelle
  views/             Seiten der Anwendung
```

Der Datensatz liegt unter `src/assets/data/conference-data.json` und wird inhaltlich unverändert verwendet.

## Geplante Erweiterungen

- Session-Suche und Filter
- Vollständige Session-Details und Speakerprofile
- Persönliche Session-Auswahl mit Speicherung in `localStorage`
- PWA und Offline-Verfügbarkeit
- Manueller Theme-Umschalter

Die Entscheidungen zu Branding, Ordnerstruktur, State-Management und Technologie-Setup sind unter `docs/schritt1/` dokumentiert.