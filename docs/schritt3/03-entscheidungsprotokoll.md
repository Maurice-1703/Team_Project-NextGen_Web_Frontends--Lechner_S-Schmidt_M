# D – Entscheidungsprotokoll: Rendering und Offline-Caching
 
**Entwurf:** Maurice · **Ergänzung/Korrektur:** Sam
**Bezug:** `docs/schritt2/01-rendering-strategie-adr.md` (Schritt 2), `docs/schritt3/02-offline-strategie-konzept.md` (Konzept B)
 
## Kontext
 
CouchCoding wird während einer zweitägigen Konferenz genutzt. Das Konferenz-WLAN ist überlastet und hängt häufig, zwischen zwei Sessions sind viele Geräte im Flugmodus. Teilnehmende müssen trotzdem jederzeit nachsehen können, wann und in welchem Raum die nächste Session beginnt, und ihr persönliches Programm öffnen können.
 
In Schritt 2 haben wir entschieden, Session-Detailseiten, Speaker-Profile und die Session-Übersicht mit `vite-ssg` beim Build als HTML vorzurendern (SSG) und „Mein Couch-Programm“ erst im Browser zu befüllen (CSR), weil die Auswahl nur in `localStorage` existiert. `conference-data.json` wird statisch importiert und steckt damit im JS-Bundle; es gibt kein Backend und keinen Datenabruf per `fetch`. Diese Architektur bestimmt, welche Dateien ein Service Worker offline überhaupt ausliefern kann: vorgerenderte HTML-Seiten, JS- und CSS-Bundle, Icons und das Manifest.
 
## Optionen
 
1. **Kein Service Worker (Network Only):** Verhalten wie bisher. Ohne Netz zeigt der Browser seine Fehlerseite, auch wenn „Mein Programm“ in `localStorage` vorliegt.
2. **Runtime-Caching mit Cache First:** Dateien werden erst beim ersten Abruf gespeichert. Nie besuchte Detailseiten fehlen offline; nach einem neuen Build bliebe alte HTML neben dem neuen Bundle im Cache.
3. **Stale While Revalidate für die Programmseiten:** zeigt sofort den Cache-Stand und aktualisiert im Hintergrund. Weil die Daten zusätzlich im Bundle stecken, würde eine aktualisierte HTML nach der Hydration von Vue mit dem alten Wert überschrieben.
4. **Network First:** immer aktuell, im hängenden WLAN aber Wartezeit bis zum Timeout, obwohl die Daten lokal vorliegen.
5. **Cache First durch versionierten Precache:** alle Build-Dateien werden bei der Installation des Service Workers gespeichert und danach ohne Netzanfrage ausgeliefert.
## Entscheidung
 
Wir wählen **Option 5** für alle Datentypen aus Konzept B: App-Shell, Session- und Speaker-Seiten sowie statische Assets. „Mein Couch-Programm“ braucht keine eigene Regel, weil der Service Worker keinen Zugriff auf `localStorage` hat; offline erreichbar wird es über die vorab gespeicherte App-Shell inklusive `my-program.html`. Umgesetzt ist das mit `vite-plugin-pwa` (Workbox, Modus `generateSW`) über `workbox.globPatterns` in `vite.config.ts`, mit einem kommentierten Eintrag je Datentyp. Updates übernimmt der Service Worker mit `registerType: 'autoUpdate'` sofort.
 
## Konsequenzen
 
- Nach einem erfolgreichen Online-Besuch sind alle Seiten offline verfügbar, auch nie einzeln geöffnete Detailseiten.
- HTML und JS-Bundle stammen immer aus demselben Build; ein Hydration-Mismatch durch unterschiedliche Datenstände ist ausgeschlossen.
- Der erste Besuch lädt einmalig alle Dateien vorab (derzeit 53 Einträge, ca. 422 KB).
- Programmänderungen erreichen Nutzer nur über einen neuen Build. Mit `autoUpdate` lädt die Seite danach einmal neu; Filter (URL) und Auswahl (`localStorage`) bleiben erhalten.
- Ohne vorherigen Online-Besuch ist kein Offline-Betrieb möglich (siehe Szenario iii).
## Testszenarien
 
**Testumgebung**
 
| | Maurice | Sam |
| --- | --- | --- |
| Betriebssystem | Windows 11 Home [25H2] | [OS] [Version] |
| Browser | Chrome [157.0.8103.79] | [Browser] [Version] |
| Getesteter Stand | Commit `ebb2b52` | Commit `[ID]` |
| Start | `npm run build` → `npm run preview` (`http://localhost:4173`) | ebenso |
 
Vor jedem Szenario wurde unter DevTools → Application → Storage „Clear site data“ ausgeführt, damit kein alter Service Worker das Ergebnis verfälscht.
 
---
 
### Szenario i – Session-Übersicht im Flugmodus
 
- **Ausgangslage:** Die App wurde einmal online unter `/sessions` geladen. In DevTools → Application → Service Workers ist `sw.js` als „activated and is running“ markiert, unter Cache Storage existiert `workbox-precache-…`.
- **Aktion:** Network-Tab → „Offline“ aktiviert. `/sessions` neu geladen. Danach ein Filter gesetzt (z. B. Track), die gefilterte Seite neu geladen und über eine Session-Karte eine Detailseite geöffnet und neu geladen.
- **Erwartet (laut Konzept B):** Die Übersicht erscheint mit allen 20 Sessions; im Network-Tab steht bei `sessions.html` „(ServiceWorker)“. Filtern funktioniert, weil es im Browser aus den Bundle-Daten berechnet wird. Detailseiten und gefilterte URLs funktionieren auch nach einem Reload.
- **Beobachtet – Maurice:** Erster Test auf Commit `b941767`: Der Offline-Reload von `/sessions?track=frontend-architecture` zeigte zwar die gefilterte Liste („4 von 20 Sessions“), im Reiter Response stand jedoch die vorgerenderte Branding-Seite. Der Precache kannte die URL mit Parameter nicht, der Standard-Fallback lieferte `index.html`; die Console meldete einen Hydration-Mismatch, `registerSW.js` schlug mit `ERR_INTERNET_DISCONNECTED` fehl. Nach `fea7cc5` (`ignoreURLParametersMatching`) und `0fe78d4` (`registerSW.js` im Precache) enthielt die Response die echte `sessions.html`, die Console blieb leer. Alle Anfragen zeigten in der Spalte „Size“ „(ServiceWorker)“. Auch die nie zuvor geöffnete Detailseite `/sessions/s17` lud offline vollständig. Im Cache Storage lagen 53 Einträge.
- **Beobachtet – Sam:** [ ]
- **Bewertung:** Das Verhalten entspricht Konzept B: Übersicht, gefilterte URLs und Detailseiten kommen offline aus dem Precache. Der erste Test deckte zwei Lücken auf (Query-Parameter, `registerSW.js`), die wir mit eigenen Commits geschlossen haben. Offen bleibt: Für nicht existierende Adressen (z. B. `/branding`) liefert der Fallback die Sessions-HTML, und Vue zeigt eine gemischte Seite aus Überschrift der Übersicht und NotFound-Text.
---
 
### Szenario ii – „Mein Couch-Programm“ offline
 
- **Ausgangslage:** Online wurden drei Sessions über die Detailseite zu „Mein Couch-Programm“ hinzugefügt (z. B. `s01`, `s02`, `s03`). In DevTools → Application → Local Storage steht unter `frontendnow:2026:my-program:v1` das ID-Array.
- **Aktion:** Network-Tab → „Offline“ aktiviert. `/my-program` direkt aufgerufen und neu geladen. Danach eine Session entfernt und erneut neu geladen.
- **Erwartet (laut Konzept B):** Die Seitenhülle kommt aus dem Precache, nach dem Mounten liest der Store die IDs aus `localStorage` und zeigt die drei Sessions nach Tag gruppiert an. Das Entfernen funktioniert offline und bleibt nach dem Reload erhalten, weil `localStorage` nicht vom Netz abhängt.
- **Beobachtet – Maurice:** Nach dem Hinzufügen von s01, s02, s03 stand das ID-Array unter `frontendnow:2026:my-program:v1` im Local Storage. Offline lud `/my-program` per Reload vollständig; `my-program.html` kam laut Spalte „Size“ aus dem Service Worker. Für einen Sekundenbruchteil war die vorgerenderte Hülle mit dem Ladehinweis zu sehen, danach erschienen die drei Sessions nach Tag gruppiert. Das Entfernen einer Session funktionierte offline und blieb nach einem weiteren Reload erhalten.
- **Beobachtet – Sam:** [ ]
- **Bewertung:** Das bestätigt die Entscheidung aus Konzept B, für „Mein Couch-Programm“ keine eigene Caching-Regel anzulegen: Die Daten liegen in `localStorage` und sind unabhängig vom Netz, der Service Worker muss nur die Hülle liefern. Die kurz sichtbare Hülle entspricht der Rendering-ADR aus Schritt 2 (CSR nach dem Mounten); sie verhindert, dass beim Build eine falsche oder leere Auswahl als fertiges Programm ausgeliefert wird.
---
 
### Szenario iii – Erstbesuch ohne vorheriges Online-Laden (Grenzfall)
 
- **Ausgangslage:** Neues Inkognito-Fenster bzw. „Clear site data“ ausgeführt. Unter Application → Service Workers ist kein Service Worker registriert, Cache Storage ist leer.
- **Aktion:** Zuerst Network-Tab → „Offline“ aktiviert, danach `http://localhost:4173/sessions` aufgerufen.
- **Erwartet:** Die Fehlerseite des Browsers („Keine Internetverbindung“). Ein Service Worker wird erst beim ersten erfolgreichen Online-Besuch installiert; vorher existiert keine Instanz, die eine Anfrage aus dem Cache beantworten könnte.
- **Beobachtet – Maurice:** Nach „Clear site data“ waren unter Application weder ein Service Worker registriert noch Einträge im Cache Storage vorhanden. Mit aktiviertem Offline-Modus zeigte der Aufruf von `/sessions` die Fehlerseite des Browsers mit dem Code `ERR_INTERNET_DISCONNECTED`; die Anwendung war nicht erreichbar, und es wurde kein Service Worker registriert. Nach dem Ausschalten des Offline-Modus und einem Reload installierte sich der Service Worker; ein anschließender Offline-Reload funktionierte wieder.
- **Beobachtet – Sam:** [ ]
- **Bewertung:** Das Verhalten ist erwartet und akzeptabel, weil es technisch nicht vermeidbar ist: Ein Service Worker wird erst beim ersten erfolgreichen Online-Besuch installiert. Ohne vorherigen Kontakt zum Server hat der Browser weder Code noch Daten der App. Abhilfe ist nur organisatorisch möglich, z.B. ein Hinweis in der Anmeldebestätigung oder ein QR-Code am Eingang, die App vorab im Hotel-WLAN zu öffnen und zu installieren. Dass der erste Besuch rund 422 KB vorab lädt, ist der Preis dafür, dass danach alle Seiten offline verfügbar sind.
 