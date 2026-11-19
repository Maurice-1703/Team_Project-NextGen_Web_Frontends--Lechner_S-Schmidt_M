# B – Offline-Strategie: Caching je Datentyp
 
## Kontext und bestehende Architektur
 
CouchCoding begleitet Teilnehmende der zweitägigen FrontendNow-Konferenz. Im überlasteten Konferenz-WLAN oder im Flugmodus muss insbesondere der nächste Vortrag mit Uhrzeit und Raum ohne Netzwerk-Timeout auffindbar bleiben. Die Rendering-Entscheidungen aus Schritt 2 werden übernommen: `vite-ssg` erzeugt Übersichtsseiten und 20 Session- sowie 18 Speaker-Detailseiten als HTML. `conference-data.json` wird von `useConferenceData()` statisch importiert und in das JavaScript-Bundle eingebunden; es existiert kein separater Datenabruf per `fetch`. Ein Backend ist nicht vorgesehen. Die Session-Filter werden laut Rendering-ADR erst im Browser anhand der URL-Parameter angewendet. Deshalb muss nicht jede Filterkombination separat gecacht werden.
 
## Caching-Entscheidungen
 
| Datentyp | Gewählte Strategie | Begründung |
| --- | --- | --- |
| Session-Daten | **Cache First durch versionierten Precache** | `sessions/*.html` und die Daten im JS-Bundle; Änderungen erfordern einen Build. |
| Speaker-Daten | **Cache First durch versionierten Precache** | `speakers/*.html`; Profile sollen auch per Direktlink offline erreichbar sein. |
| App-Shell | **Cache First durch versionierten Precache** | HTML für `/`, `/branding`, `/sessions`, `/speakers`, `/my-program` sowie JS und CSS; ohne sie zeigt keine Seite Inhalte. |
| Statische Assets | **Cache First durch versionierten Precache** | Manifest, lokale Icons und Schriftdateien bei lokaler Einbindung. |
| „Mein Couch-Programm“ | **`localStorage` + gecachte App-Shell** | Der Store speichert unter `frontendnow:2026:my-program:v1` nur Session-IDs. Nach dem Mounten werden diese mit den gecachten Session-Daten aufgelöst; der Service Worker speichert keine persönlichen Daten. |
 
Beim Precache werden die bekannten Build-Ressourcen bereits während der Service-Worker-Installation gespeichert. Workbox liefert sie anschließend cache-first aus. Das ist für den kleinen, endlichen Konferenzdatensatz geeigneter als reines Runtime-Caching: Auch eine nie zuvor einzeln besuchte Detailseite ist nach erfolgreicher Installation offline verfügbar. Workbox ordnet URLs ohne Endung wie `/sessions/s07` der von `vite-ssg` erzeugten Datei `sessions/s07.html` zu. Query-Parameter der Filter werden beim Cache-Abgleich ignoriert, sodass auch ein Reload von `/sessions?track=t2` offline die gecachte Übersicht findet.
 
## Abgewogene Alternativen
 
**Stale While Revalidate** würde zuerst den letzten Cache-Stand anzeigen und bei vorhandener Verbindung eine Aktualisierung anstoßen. Das wäre vorzuziehen, wenn kurzfristige Raum- oder Zeitänderungen über eine unabhängig abrufbare, aktuelle Datenquelle bereitgestellt würden. Derzeit liegen diese Informationen jedoch gleichzeitig in HTML und JS-Bundle. Deren unabhängige Aktualisierung könnte unterschiedliche Datenstände erzeugen. **Network First** wäre für solche Live-Daten ebenfalls möglich, verursacht im hängenden WLAN jedoch Wartezeiten bis zum Netzwerkfehler. Deshalb wählen wir für die bestehenden statischen Ressourcen Cache First und verzichten auf SWR.
 
## Aktualisierung und vollständiger Ausfall
 
Programmänderungen erfordern gemäß Rendering-ADR einen neuen Build und ein Deployment. Der neue Service Worker ersetzt nur geänderte Precache-Einträge. Wir wählen `registerType: 'autoUpdate'`: Er übernimmt sofort und lädt die Seite einmal neu. Das ist vertretbar, weil Filter in der URL und die Auswahl in `localStorage` erhalten bleiben. Nach erfolgreicher Installation funktionieren Startseite, Sessionübersicht und „Mein Couch-Programm“ bei Verbindungsabbruch und Reload ohne Netz. Bricht die Erstinstallation ab, entsteht kein Teil-Cache, sondern gar keiner. Beim allerersten Aufruf ohne Verbindung ist die Anwendung nicht verfügbar. Wird der Browser-Speicher gelöscht, können Cache-Einträge beziehungsweise gespeicherte Session-IDs verloren gehen. Diese Grenzen, die Auswahlwiederherstellung und die Direktnavigation werden in Schritt D/E praktisch getestet.