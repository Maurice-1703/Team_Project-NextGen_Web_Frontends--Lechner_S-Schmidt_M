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
 
Wir wählen **Option 5** für App-Shell, Session- und Speaker-Seiten sowie statische Assets. `vite-plugin-pwa` erzeugt daraus einen Workbox-Service-Worker im Modus `generateSW`. Die kommentierten `workbox.globPatterns` in `vite.config.ts` erfassen die vorgerenderten Seiten und das JS-Bundle mit den Konferenzdaten. Für „Mein Couch-Programm“ kommt `my-program.html` aus dem Precache. Vue liest die gespeicherten IDs nach dem Mounten aus `localStorage` und verknüpft sie mit den Session-Daten aus dem Bundle.
 
## Konsequenzen
 
- Nach dem ersten Online-Besuch mit abgeschlossener Service-Worker-Installation sind die Programmseiten offline verfügbar, auch nie einzeln geöffnete Detailseiten.
- Das vorgerenderte HTML und das JS-Bundle im Precache stammen aus demselben Build. Liefert Workbox für eine andere Route die vorgerenderte Startseite, rendert Vue die angeforderte Ansicht neu.
- Der getestete Build speichert 53 Dateien mit zusammen 423,70 KiB laut Workbox-Buildlog vorab.
- Programmänderungen erreichen Nutzer über einen neuen Build. `autoUpdate` aktiviert den neuen Service Worker und lässt ihn offene Tabs übernehmen. Die Ansicht aktualisiert sich beim nächsten Laden. Filter in der URL und die Auswahl in `localStorage` bleiben erhalten.
- Ohne vorherigen Online-Besuch ist kein Offline-Betrieb möglich (siehe Szenario iii).

## Testszenarien
 
**Testumgebung**
 
| | Maurice | Sam |
| --- | --- | --- |
| Betriebssystem | Windows 11 Home 25H2 | Windows 11 Pro 25H2 (Build 26200.9974) |
| Browser im dokumentierten Lauf | Chrome 157.0.8103.79 | Chrome 158.0.8127.88 (Headless) |
| Getesteter Stand | Commit `ebb2b52` | PR #3 `dc56256`, Wiederholung auf `c8f7c5a` |
| Start | `npm run build` → `npm run preview` (`http://localhost:4173`) | `npm run build` → Vite Preview (`http://localhost:44173`) |
 
Maurice nutzte „Clear site data“ in Chrome DevTools. Ich habe die drei Szenarien auf meinem Rechner erneut durchgespielt und dieselben Ergebnisse erhalten wie im aufgezeichneten Chrome-Lauf. Die Screenshots und das Netzwerkprotokoll zu diesem Lauf sind den Szenarien im Verifikationsnachweis zugeordnet. [Verifikationsnachweis](04-verifikations-nachweis.md)
 
---
 
### Szenario i – Session-Übersicht im Flugmodus
 
- **Ausgangslage:** Die App wurde einmal online unter `/sessions` geladen. In DevTools → Application → Service Workers ist `sw.js` als „activated and is running“ markiert, unter Cache Storage existiert `workbox-precache-…`.
- **Aktion:** Network-Tab → „Offline“ aktiviert. `/sessions` neu geladen. Danach ein Filter gesetzt (z. B. Track), die gefilterte Seite neu geladen und über eine Session-Karte eine Detailseite geöffnet und neu geladen.
- **Erwartet (laut Konzept B):** Die Übersicht erscheint mit allen 20 Sessions; im Network-Tab steht bei `sessions.html` „(ServiceWorker)“. Filtern funktioniert, weil es im Browser aus den Bundle-Daten berechnet wird. Detailseiten und gefilterte URLs funktionieren auch nach einem Reload.
- **Beobachtet – Maurice:** Erster Test auf Commit `b941767`: Der Offline-Reload von `/sessions?track=frontend-architecture` zeigte zwar die gefilterte Liste („4 von 20 Sessions“), im Reiter Response stand jedoch die vorgerenderte Branding-Seite. Der Precache kannte die URL mit Parameter nicht, der Standard-Fallback lieferte `index.html`; die Console meldete einen Hydration-Mismatch, `registerSW.js` schlug mit `ERR_INTERNET_DISCONNECTED` fehl. Nach `fea7cc5` (`ignoreURLParametersMatching`) und `0fe78d4` (`registerSW.js` im Precache) enthielt die Response die echte `sessions.html`, die Console blieb leer. Alle Anfragen zeigten in der Spalte „Size“ „(ServiceWorker)“. Auch die nie zuvor geöffnete Detailseite `/sessions/s17` lud offline vollständig. Im Cache Storage lagen 53 Einträge.
- **Mein Gegencheck (Sam).** Ich habe die Sessionübersicht zuerst online geöffnet und dann offline neu geladen. Ohne Filter wurden „20 von 20 Sessions“ angezeigt. Mit dem Track-Filter `frontend-architecture` zeigte die Seite nach dem Reload „4 von 20 Sessions“. Auch die Startseite und die zuvor ungeöffneten Detailseiten `/sessions/s17` und `/speakers/sp07` konnte ich offline öffnen. Im getesteten Stand `c8f7c5a` zeigte `/branding` die Meldung „Seite nicht gefunden“ und die Konsole blieb leer.
- **Bewertung:** Beide Tests bestätigen die Cache-First-Entscheidung aus B. Die Änderungen für Filter-URLs und `registerSW.js` schließen die zuerst beobachteten Fehler. Beim Fallback kommt weiterhin `index.html` aus dem Cache. Vue baut bei einem abweichenden Pfad die passende Ansicht auf.

---
 
### Szenario ii – „Mein Couch-Programm“ offline
 
- **Ausgangslage:** Online wurden drei Sessions über die Detailseite zu „Mein Couch-Programm“ hinzugefügt (z. B. `s01`, `s02`, `s03`). In DevTools → Application → Local Storage steht unter `frontendnow:2026:my-program:v1` das ID-Array.
- **Aktion:** Network-Tab → „Offline“ aktiviert. `/my-program` direkt aufgerufen und neu geladen. Danach eine Session entfernt und erneut neu geladen.
- **Erwartet (laut Konzept B):** Die Seitenhülle kommt aus dem Precache, nach dem Mounten liest der Store die IDs aus `localStorage` und zeigt die drei Sessions nach Tag gruppiert an. Das Entfernen funktioniert offline und bleibt nach dem Reload erhalten, weil `localStorage` nicht vom Netz abhängt.
- **Beobachtet – Maurice:** Nach dem Hinzufügen von s01, s02, s03 stand das ID-Array unter `frontendnow:2026:my-program:v1` im Local Storage. Offline lud `/my-program` per Reload vollständig; `my-program.html` kam laut Spalte „Size“ aus dem Service Worker. Für einen Sekundenbruchteil war die vorgerenderte Hülle mit dem Ladehinweis zu sehen, danach erschienen die drei Sessions nach Tag gruppiert. Das Entfernen einer Session funktionierte offline und blieb nach einem weiteren Reload erhalten.
- **Mein Gegencheck (Sam).** Ich habe drei Sessions online gespeichert und danach „Mein Couch-Programm“ offline geöffnet. Nach dem Neuladen wurden alle drei Sessions nach Datum gruppiert angezeigt. Ich habe `s02` entfernt und die Seite erneut geladen. `s01` und `s17` blieben auf der Seite und in `localStorage` erhalten. Das Netzwerkprotokoll zeigt für beide Reloads HTTP 200 aus dem Cache.
- **Bewertung:** Das bestätigt die Entscheidung aus Konzept B, für „Mein Couch-Programm“ keine eigene Caching-Regel anzulegen: Die Daten liegen in `localStorage` und sind unabhängig vom Netz, der Service Worker muss nur die Hülle liefern. Die kurz sichtbare Hülle entspricht der Rendering-ADR aus Schritt 2 (CSR nach dem Mounten); sie verhindert, dass beim Build eine falsche oder leere Auswahl als fertiges Programm ausgeliefert wird.
---
 
### Szenario iii – Erstbesuch ohne vorheriges Online-Laden (Grenzfall)
 
- **Ausgangslage:** Neues Inkognito-Fenster bzw. „Clear site data“ ausgeführt. Unter Application → Service Workers ist kein Service Worker registriert, Cache Storage ist leer.
- **Aktion:** Zuerst Network-Tab → „Offline“ aktiviert, danach `http://localhost:4173/sessions` aufgerufen.
- **Erwartet:** Die Fehlerseite des Browsers („Keine Internetverbindung“). Ein Service Worker wird erst beim ersten erfolgreichen Online-Besuch installiert; vorher existiert keine Instanz, die eine Anfrage aus dem Cache beantworten könnte.
- **Beobachtet – Maurice:** Nach „Clear site data“ waren unter Application weder ein Service Worker registriert noch Einträge im Cache Storage vorhanden. Mit aktiviertem Offline-Modus zeigte der Aufruf von `/sessions` die Fehlerseite des Browsers mit dem Code `ERR_INTERNET_DISCONNECTED`; die Anwendung war nicht erreichbar, und es wurde kein Service Worker registriert. Nach dem Ausschalten des Offline-Modus und einem Reload installierte sich der Service Worker; ein anschließender Offline-Reload funktionierte wieder.
- **Mein Gegencheck (Sam).** Ich habe `/sessions` in einem frischen Chrome-Kontext zuerst offline aufgerufen. Dabei erschien die Browser-Fehlerseite mit `ERR_INTERNET_DISCONNECTED`. Danach habe ich die App einmal online geladen. Beim anschließenden Offline-Reload war die Übersicht verfügbar. Im Netzwerkprotokoll ist für diesen Reload HTTP 200 aus dem Cache vermerkt.
- **Bewertung:** Der Browser braucht beim Erstbesuch Netz, um die App und ihren Service Worker zu laden. Die Browser-Fehlerseite ist für diesen Grenzfall erwartbar. Ein Hinweis in der Anmeldebestätigung kann Teilnehmende dazu anregen, die App vor Beginn der Konferenz einmal online zu öffnen.
