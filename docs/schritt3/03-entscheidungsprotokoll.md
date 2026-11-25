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
 
### Szenario i – Sessionübersicht im simulierten Flugmodus

Nach einem Online-Aufruf mit aktivem Service Worker haben wir die Sessionübersicht offline mit und ohne Track-Filter neu geladen und eine Detailseite direkt geöffnet.

**Maurice.** Auf `b941767` lieferte die Filter-URL die Branding-Seite. Die Konsole meldete einen Hydration-Fehler und `registerSW.js` scheiterte. Mit `fea7cc5` und `0fe78d4` kamen `sessions.html` und die zuvor ungeöffnete Session `s17` aus dem Cache.

**Sam.** Ich sah 20 Sessions ohne Filter und vier mit `frontend-architecture`. Die Startseite, `s17` und das zuvor ungeöffnete Speakerprofil `sp07` öffneten sich offline. Auf `c8f7c5a` zeigte `/branding` „Seite nicht gefunden“. Die Konsole blieb leer. Die DevTools-Aufnahme zeigt auch einen Offline-Reload von `s06`.

**Bewertung.** Die vorab gespeicherten Programmseiten bestätigen Cache First. Beim Fallback zeigt Vue die passende Ansicht.

### Szenario ii – „Mein Couch-Programm“ offline

Wir haben online jeweils drei Sessions gespeichert. Offline haben wir `/my-program` neu geladen, eine Session entfernt und erneut geladen.

**Maurice.** Speichern von `s01`, `s02` und `s03`. Kurz war der Ladehinweis zu sehen, dann erschien die Auswahl nach Datum gruppiert. Die entfernte Session fehlte auch nach dem Reload.

**Sam.** Ich sah die drei Sessions nach Datum gruppiert. Nachdem ich `s02` entfernt hatte, blieben `s01` und `s17` auch nach dem Reload auf der Seite und in `localStorage`. Das Protokoll zeigt für beide Reloads HTTP 200 aus dem Cache.

**Bewertung.** Der Service Worker liefert die Seitenhülle. Vue liest die Auswahl aus `localStorage` und ordnet sie den vorab gespeicherten Programmdaten zu.

### Szenario iii – Erstbesuch ohne Netz

Für diesen Grenzfall haben wir die Website-Daten gelöscht oder einen frischen Chrome-Kontext verwendet. Dann haben wir `/sessions` zum ersten Mal offline aufgerufen.

**Maurice.** Chrome zeigte `ERR_INTERNET_DISCONNECTED`. Cache Storage war leer und es war kein Service Worker registriert. Nach einem Online-Aufruf funktionierte der nächste Offline-Reload.

**Sam.** Ich bekam dieselbe Chrome-Fehlerseite. Nach einem Online-Aufruf konnte ich die Übersicht offline neu laden. Im Netzwerkprotokoll steht für diesen Reload HTTP 200 aus dem Cache.

**Bewertung.** Die Browsermeldung beim Erstbesuch war erwartet. Der Browser benötigt zunächst eine Verbindung, um die App zu laden und den Service Worker zu installieren. Ein Hinweis in der Anmeldebestätigung kann Teilnehmende daran erinnern, die App vorab online zu öffnen.
