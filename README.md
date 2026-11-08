# CouchCoding

CouchCoding ist die Konferenzplattform für die fiktive Frontend-Konferenz **FrontendNow**. Teilnehmende können das Konferenzprogramm filtern, Sessiondetails und Speakerprofile ansehen und sich ein persönliches Programm zusammenstellen.

## Funktionsumfang

- **Sessionübersicht** mit 20 Sessions und kombinierbaren Filtern für Track, Konferenztag und Level. Die Auswahl steht in der URL und lässt sich als Link teilen.
- **Session-Detailseiten** mit Titel, Abstract, Datum, Uhrzeit, Raum, Track, Level, Format und Links zu den beteiligten Speakern.
- **Speakerübersicht und 18 Speakerprofile** mit Name, beruflichem Titel, Firma, Bio und Links zu den gehaltenen Sessions.
- **Mein Couch-Programm** zum Hinzufügen und Entfernen von Sessions. Die Auswahl wird im Browser gespeichert, nach einem Reload wiederhergestellt und nach Konferenztag und Startzeit angezeigt.
- **Gemeinsames Branding** mit Navigation, Design-Tokens und einem Farbschema, das der Systemeinstellung folgt.

## Voraussetzungen und Installation

Empfohlen sind Node.js **24.22.0** und npm **11.19.1**. Führe die folgenden Befehle im Projektordner aus, in dem die `package.json` liegt.

```bash
node --version
npm --version
npm ci
```

`npm ci` installiert die Abhängigkeiten einschließlich `vite-ssg` anhand der `package-lock.json`.

## Entwicklung und lokale Vorschau

Für die Entwicklung startest du den Vite-Server.

```bash
npm run dev
```

Öffne die Adresse aus dem Terminal. Standardmäßig ist das `http://localhost:5173`. Der Server übernimmt gespeicherte Änderungen automatisch.

Für die Prüfung des Produktionsstands erzeugst du zuerst den Build und startest dann die Vorschau.

```bash
npm run build
npm run preview
```

`npm run build` prüft TypeScript und erzeugt mit `vite-ssg` die statischen Seiten in `dist/`. Die Vorschau ist normalerweise unter `http://localhost:4173` erreichbar. Beide Server lassen sich mit `Ctrl+C` beenden. In Windows PowerShell kannst du bei Bedarf `npm.cmd` anstelle von `npm` verwenden.

## Routen

| Adresse | Inhalt |
| --- | --- |
| `/` | Weiterleitung zu `/branding` |
| `/branding` | Beispielansicht für Branding und Design-Tokens |
| `/sessions` | Übersicht mit Filtern nach Track, Konferenztag und Level |
| `/sessions/:id` | Sessiondetails mit Speakerlinks und Programmauswahl |
| `/speakers` | Übersicht aller Speaker mit Links zu ihren Profilen |
| `/speakers/:id` | Speakerprofil mit Bio und Links zu den gehaltenen Sessions |
| `/my-program` | Persönliches Programm mit den ausgewählten Sessions |
| Sonstige Pfade | Fehleransicht der App |

## Rendering in Schritt 2

| Anwendungsteil | Beim Build | Im Browser |
| --- | --- | --- |
| Sessionübersicht | `dist/sessions.html` enthält die vollständige Liste mit 20 Sessions. | Nach dem Mounten liest `useSessionFilter()` die URL-Parameter `track`, `day` und `level`. Die aktiven Filter werden mit UND verknüpft. |
| Sessiondetails | Für jede Session entsteht eine eigene HTML-Datei mit den Detaildaten und Speakerlinks. | Der Programm-Button übernimmt den persönlichen Auswahlzustand, sobald die gespeicherte Auswahl geladen ist. Bis dahin ist er deaktiviert. |
| Speakerübersicht und Profile | Die Übersicht und alle 18 Profile werden statisch generiert. Name, Bio und Sessionlinks stehen bereits im HTML. | Vue übernimmt nach der Hydration die Navigation innerhalb der App. |
| Mein Couch-Programm | Die HTML-Datei enthält die Überschrift und den Hinweis „Deine Auswahl wird geladen …“. | Die persönliche Liste wird nach dem Mounten aus der gespeicherten Auswahl aufgebaut. |

Die IDs für die statischen Session- und Speaker-Routen stammen aus `useConferenceData()`. Änderungen an den Konferenzdaten werden nach einem neuen Build und Deploy sichtbar. [Rendering-ADR für Schritt 2](docs/schritt2/01-rendering-strategie-adr.md)

## Daten und persönliches Programm

Die Konferenzdaten liegen in `src/assets/data/conference-data.json`. `useConferenceData()` stellt sie schreibgeschützt bereit und löst Beziehungen zwischen Sessions, Speakern, Tracks und Räumen über IDs auf.

„Mein Couch-Programm“ speichert die ausgewählten Session-IDs unter `frontendnow:2026:my-program:v1` in `localStorage`. Der Store liest die Auswahl nach dem Mounten ein und übernimmt Änderungen aus anderen Tabs derselben Origin. Das Projekt verwendet Vue 3, TypeScript, Vue Router, Vite und `vite-ssg`. Für das persönliche Programm genügen Browser-Speicher und der gemeinsame Vue-Store.

## Produktionsstand kurz testen

1. **Filter:** Öffne `/sessions`. Die Übersicht zeigt 20 Sessions. Öffne anschließend `/sessions?track=rendering-performance&day=2026-09-15&level=Experte`. Nach dem Laden sollte nur die Session `s10` erscheinen.
2. **Verlinkung:** Öffne `/speakers/sp01`, folge einem Sessionlink und klicke auf der Detailseite wieder auf **Mara Lindqvist**. Der Seitenquelltext von `/speakers/sp01` enthält bereits das Profil und seine Sessionlinks.
3. **Programmauswahl:** Füge auf einer Session-Detailseite eine Session hinzu. Öffne `/my-program`, lade die Seite neu und prüfe, ob die Session weiterhin angezeigt wird. Entferne sie anschließend wieder.

## Projektstruktur

```text
docs/schritt1/        Branding, Architektur, State-Management und Technologie
docs/schritt2/        Rendering-ADR und persönliche AI-Logs
tokens/              Design-Tokens für Farben, Typografie und Abstände
src/
  assets/data/       Konferenzdatensatz
  components/
    base/            Allgemeine UI-Bausteine
    feature/         Komponenten für Sessions, Speaker und Programmauswahl
    layout/          Seitenrahmen, Header und Navigation
  composables/       Datenzugriff und Session-Filter
  router/            Routendefinitionen
  stores/            Zustand für „Mein Couch-Programm“
  styles/            Globale Basisstyles
  types/             TypeScript-Datenmodelle
  views/             Übersichten, Detailseiten und persönliches Programm
```

## Geplante Erweiterungen

- Session-Suche
- PWA und Offline-Verfügbarkeit der App
- Manueller Theme-Umschalter