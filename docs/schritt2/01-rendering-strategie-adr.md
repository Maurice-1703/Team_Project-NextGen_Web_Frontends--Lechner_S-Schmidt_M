# ADR: Rendering-Strategie pro Anwendungsteil

## Einleitung

In ADR D haben wir uns für Vue 3 mit Vite und Vue Router entschieden und die Rendering-Frage auf Schritt 2 verschoben. Ohne weitere Maßnahmen wäre CouchCoding damit eine reine Client-Side-Anwendung. Wir entscheiden deshalb pro Anwendungsteil, wo und wann das HTML entsteht. Unsere Kriterien sind: Ändert sich der Inhalt zur Laufzeit? Ist er personalisiert und nur im Browser bekannt? Wie schnell muss der Hauptinhalt beim ersten Aufruf im unzuverlässigen Konferenz-WLAN sichtbar sein? Und welcher Aufwand entsteht ohne eigenes Backend? Für vorgerenderte Seiten ergänzen wir das bestehende Setup um `vite-ssg`, statt auf Nuxt umzusteigen. Damit bleibt ADR D gültig.

## 1. Speaker-Profile (`/speakers/:id`)

**Federführung:** _Sam_ · **Review:** _Maurice_

### Kontext

Die 18 Speaker-Profile zeigen Name, Titel, Firma, Bio und die gehaltenen Sessions. Alle Daten stammen aus der statisch importierten `conference-data.json`. Sie sind für alle Nutzer gleich und ändern sich während der Konferenz nicht. Teilnehmende öffnen Profile oft über geteilte Links, z. B. aus dem Konferenz-Chat, und damit häufig als ersten Aufruf ohne geladene App.

### Optionen

**CSR:** Kein zusätzliches Setup. Der Browser lädt jedoch zuerst eine leere `index.html` und das gesamte JS-Bundle, erst danach erscheint das Profil. Link-Vorschauen und Suchmaschinen ohne JavaScript sehen nur den Seitentitel.

**SSG:** Jedes Profil wird beim Build zu einer eigenen HTML-Datei. Der Inhalt ist sofort sichtbar, auch bevor das JavaScript geladen ist.

**SSR:** Wäre ebenfalls sofort sichtbar, bräuchte aber einen laufenden Server, ohne dass ein Profil bei einer Anfrage aktueller wäre als beim Build.

### Entscheidung

Wir wählen **SSG**. Die Daten ändern sich zur Laufzeit nicht, also gibt es nichts, was ein Server pro Anfrage besser machen könnte. Gleichzeitig bringt vorgerendertes HTML einen spürbaren Vorteil beim ersten Aufruf im schlechten WLAN.

### Konsequenzen

`vite-ssg` muss alle Speaker-IDs kennen, weil es `:id` nicht selbst auflösen kann. Wir lesen die IDs dafür über `useConferenceData()` aus, damit keine zweite Datenquelle entsteht. Ändert sich ein Profil, ist ein neuer Build nötig. Nach der Hydration verhält sich die Seite wie eine SPA, weitere Navigation läuft im Browser.

## 2. Session-Detailseiten (`/sessions/:id`)

**Federführung:** _Maurice_ · **Review:** _Sam_

### Kontext

Die 20 Detailseiten zeigen Titel, Abstract, Tag, Start- und Endzeit, Raum, Track, Level, Format und Links zu den Speakern. Titel und Abstract stehen fest. Zeit und Raum könnten sich bei einer realen Konferenz kurzfristig ändern. Unser Datensatz ändert sich aber nur durch einen neuen Build. Zusätzlich enthält die Seite den „Zum Programm hinzufügen“-Button, dessen Zustand pro Nutzer verschieden ist.

### Optionen

**SSG:** Alle 20 Seiten werden beim Build erzeugt, sofort sichtbar und ohne Server auslieferbar. Eine Zeitplanänderung erfordert einen neuen Build.

**ISR:** Seiten werden gecacht und nach einem Intervall, z. B. 60 Sekunden, im Hintergrund neu erzeugt. Änderungen wären ohne kompletten Neubau sichtbar, aber eine Hosting-Plattform mit Server wäre nötig.

**CSR:** Kein Setup, aber der Inhalt erscheint erst nach dem JavaScript.

### Entscheidung

Wir wählen **SSG** für den Seiteninhalt. Der Button-Zustand wird erst nach dem Mounten im Browser aus dem Store ergänzt. ISR wäre die richtige Wahl, sobald sich Zeiten und Räume zur Laufzeit ändern könnten. Da unsere Daten im Bundle liegen, hätte ein revalidierter Server jedoch keinen neueren Stand als der Build.

### Konsequenzen

Der Button rendert beim Build und beim ersten Rendern im Browser zunächst „nicht ausgewählt“ und ist bis dahin deaktiviert, damit kein Klick auf einen veralteten Zustand möglich ist. Erst danach übernimmt er den gespeicherten Zustand. So bleibt die Hydration konsistent, der Nutzer sieht den Zustand aber einen Moment verzögert. Bei einem echten Backend würden wir diese Entscheidung zugunsten von ISR neu bewerten.

## 3. Session-Übersicht mit Filtern (`/sessions`)

**Federführung:** _Sam_ · **Review:** _Maurice_

### Kontext

Die Übersicht zeigt alle 20 Sessions und lässt sich nach Track, Tag und Level filtern. Die Filter liegen laut ADR B in den URL-Query-Parametern. Query-Parameter erzeugen keine eigenen Dateien: `/sessions?track=x` liefert dieselbe HTML-Datei wie `/sessions`. Die Übersicht ist zugleich die Seite, auf der eine Zeitplanänderung am schnellsten sichtbar sein müsste.

### Optionen

**SSR:** Der Server rendert bei jeder Anfrage die gefilterte und aktuelle Liste. Das wäre immer aktuell, braucht aber einen Server und lohnt sich nur bei veränderlichen Daten.

**ISR:** Die ungefilterte Liste wird gecacht und periodisch erneuert. Der Server wird kaum belastet, Änderungen erscheinen bis zu ein Intervall verspätet. Filtern müsste weiterhin der Browser.

**SSG mit Filterung im Browser:** Die ungefilterte Liste wird beim Build erzeugt. `useSessionFilter()` filtert nach der Hydration im Browser.

### Entscheidung

Wir wählen **SSG für die ungefilterte Liste und CSR für die Filterung**. Ohne Backend ändern sich die Daten nicht zur Laufzeit, SSR und ISR hätten also keinen Mehrwert. Die Abwägung zwischen SSR und ISR führen wir konzeptionell und simulieren eine Zeitplanänderung, indem wir einen Raum im Datensatz ändern und neu bauen. Die Simulation zeigt, dass Nutzer bis zum nächsten Deploy den alten Stand sehen. Bei ISR wäre das höchstens ein Intervall, bei SSR keine Verzögerung.

### Konsequenzen

Beim Build gibt es keine Query. Würde der Browser beim ersten Rendern sofort filtern, wiche das Ergebnis vom vorgerenderten HTML ab (Hydration-Mismatch). Die Filter werden deshalb erst nach dem Mounten angewendet. Ein Aufruf mit Filter-Link zeigt kurz die volle Liste.

## 4. „Mein Programm“ (`/my-program`)

**Federführung:** _Maurice_ · **Review:** _Sam_

### Kontext

„Mein Couch-Programm“ zeigt die persönlich ausgewählten Sessions. Laut Konzept C liegen sie als ID-Array unter `frontendnow:2026:my-program:v1` in `localStorage`. Die Auswahl existiert nur im Browser des jeweiligen Nutzers. Beim Build gibt es weder `localStorage` noch einen Nutzer. Ein Backend und ein Login sind laut Szenario nicht vorgesehen. Die Seite muss vor Ort auch offline nach einem Reload funktionieren.

### Optionen

**SSR:** Der Server könnte die Auswahl nur rendern, wenn sie in einem Cookie oder einer Datenbank läge. Das bräuchte Backend und Login und widerspricht dem Szenario.

**SSG mit Inhalt:** Beim Build ist die Auswahl unbekannt. Jede vorgerenderte Liste wäre falsch.

**CSR:** Die Auswahl wird nach dem Mounten im Browser aus `localStorage` gelesen und gerendert.

### Entscheidung

Wir wählen **CSR für den Inhalt**. `vite-ssg` erzeugt für diese Route nur eine Hülle mit Überschrift und dem Hinweis „Deine Auswahl wird geladen …“. Einen leeren Zustand rendern wir bewusst nicht vor, weil der Build nicht wissen kann, ob Sessions gespeichert sind. Die Liste baut der Store nach dem Mounten auf. Die Seite ist personalisiert und nur im Browser bekannt, also ist CSR hier die einzige Strategie, die ohne Backend korrekt funktioniert.

### Konsequenzen

Nach einem Reload sieht der Nutzer kurz die leere Hülle, dann die gespeicherte Auswahl. Der Store darf erst nach dem Einlesen speichern, sonst überschreibt das leere Start-Array die gespeicherten IDs (Konzept C). Für die Offline-Nutzung muss der Service Worker in Schritt 3 die App-Dateien cachen. Die Daten selbst liegen bereits lokal.

## Übergreifende Konsequenzen

- `main.ts` exportiert die App über `ViteSSG(...)` statt `createApp(...).mount(...)`. Der Build-Befehl wird `vite-ssg build`, das README ist entsprechend anzupassen.
- Beim Build läuft der Code in Node.js. `window`, `document` und `localStorage` dürfen deshalb nur in `onMounted` oder im Browser-Zweig verwendet werden. Das betrifft `useTheme`, `useOnlineStatus` und `stores/myProgram.ts`.
- Das gespeicherte Theme wird erst im Browser bekannt. Ohne Gegenmaßnahme erscheint beim Laden kurz das helle Theme, bevor der Dark Mode greift.

## Nachträge

_Abweichungen, die sich bei der Umsetzung ergeben, werden hier mit Datum und Begründung ergänzt._
