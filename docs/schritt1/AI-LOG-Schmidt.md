- Prompt: „Name: Freigeister … Grundfarben: lila und rot“ (eigenes Markenkonzept vorgegeben, Claude sollte Tokens dazu bauen) 
- Übernommen: Aufbau von tokens.css (Primitive + semantische Tokens, Dark Mode über data-theme), Kontrastwerte nach WCAG AA; Datei weitgehend von Claude geschrieben 
- Geändert/verstanden: Rot als Markenfarbe selbst durch Orange ersetzt, weil Lila und Rot schwer unterscheidbar sind; Rot nur noch für Fehler
#
- Prompt: „Wie genau werden Primitive dann genutzt, wenn nicht in Komponenten?“ 
- Übernommen: präzisierte Zwei-Ebenen-Regel im Branding-Dokument (gilt nur für Farben) 
- Geändert/verstanden: Komponenten nutzen nur semantische Tokens, weil sonst der Dark Mode jede Komponente einzeln anfassen müsste
#
- Prompt: „erkläre mir genau die WCAG-AA-Kontrastprüfung für Text/Hintergrund-Paare“ 
- Übernommen: Grenzwerte 4.5:1 (Text), 3:1 (großer Text, Bedienelemente) für die Kontrasttabelle 
- Geändert/verstanden: wie man die Werte selbst im WebAIM Contrast Checker gegengeprüft
#
- Prompt: „Statt dem Freigeister Konzept … Name: CouchCoding … Farben: was wäre deine Empfehlung? finde hier lila (vielleicht eher richtung flieder) und orange auch gar nicht so schlecht“ 
- Übernommen: Palette Flieder #7A55B3 / Orange #F28A3C / Creme #FBF7F2, Neutraltöne cocoa, angepasstes Branding-Dokument 
- Geändert/verstanden: Konzept und Farbrichtung selbst vorgegeben; Sätze zur Rot-Grün-Schwäche gestrichen, weil sie nach dem Wechsel weg von Rot nicht mehr relevant sind
#
- Prompt: „erstelle mir eine kleine file um die farben zu testen“ 
- Übernommen: farbtest.html (von Claude), zeigt alle Farbpaare an Beispielelementen in Light/Dark 
- Geändert/verstanden: selbst als BrandingTest.vue in die App übernommen (später zu BrandingView umgebaut)
#
- Prompt: „macht es sinn ein allgemeines styling anzulegen?“ → „schreibe mir sie“ 
- Übernommen: src/styles/base.css komplett von Claude (Reset, body-Grundstil, Überschriften, Fokus-Ring, reduced motion) 
- Geändert/verstanden: Aufteilung verstanden, tokens.css = Werte, base.css = globale Anwendung, scoped Styles = pro Komponente
#
- Prompt: „Was versteht man unter views?“ → „ich würde eher zu nach Art der Datei ordnen, … da es doch relativ klein gehalten ist“ 
- Übernommen: Argumente Umfang und Überschneidung (SessionCard würde bei Feature-Ordnern in shared/ landen) 
- Geändert/verstanden: Entscheidung für Ordnung nach Art der Datei selbst getroffen; die vier Kriterien (Auffindbarkeit, Wiederverwendung, Erweiterbarkeit bis E8, paralleles Arbeiten) selbst formuliert
#
- Prompt: „was genau sind die Komponenten in /stores“ 
- Übernommen: Erklärung, warum geteilter Zustand nicht in ein normales Composable mit lokalem ref gehört 
- Geändert/verstanden: Claudes Pinia-Beispiel nicht übernommen: in Konzept C mit Sam entschieden, einen eigenen Store ohne Pinia zu bauen (ref<string[]>, verteilt per provide/inject)
#
- Prompt: „schaue dir genau die Dokumentation an, also 01 bis 04 und überprüfe ob alle Entscheidungen zueinander stimmig sind“ → „hilf mir konkret bei der Aufhebung der Unstimmigkeiten“ 
- Übernommen: Formulierungsvorschläge, u. a. URL als einzige Quelle der Wahrheit für den Filter, SessionsView ruft useSessionFilter() auf 
- Geändert/verstanden: Kopfzeilen-Hinweis zurückgewiesen (bewusst entfernt)



#
- Prompt: „Welche Ansätze eignen sich für das State-Management unserer Konferenzplattform? Welche Vor- und Nachteile haben gespeicherte Session-IDs gegenüber vollständigen Objekten?“
- Übernommen: Konzepttext und Sequenzdiagramm von ChatGPT; statischer JSON-Import über useConferenceData(), persönliche Auswahl als Array eindeutiger Session-IDs
- Geändert/verstanden: Konferenzdaten und persönliche Auswahl werden getrennt; IDs reichen für die Speicherung aus, weil Titel, Zeiten und weitere Sessiondaten bereits im Datensatz stehen
#
- Prompt: „Ist das State-Management-Konzept aus deiner Sicht vollständig und mit den Entscheidungen aus A und B vereinbar? Wo siehst du Unstimmigkeiten oder fehlende Punkte?“
- Übernommen: Abgleich mit A und B; im Konzept gemeinsamer Store über provide/inject, Wiederherstellung aus localStorage, Prüfung gespeicherter IDs und Synchronisierung zwischen Tabs vorgesehen
- Geändert/verstanden: Ein Composable mit lokalem ref teilt seinen Zustand nicht automatisch; gespeicherte Daten müssen vor dem ersten Zurückschreiben geladen werden, damit die leere Startauswahl nichts überschreibt; bisher als Konzept festgehalten
#
- Prompt: „Welche Vor- und Nachteile haben Vue mit TypeScript, Vite und Vue Router gegenüber Nuxt? Welches Setup hältst du für unseren Projektumfang und unsere Team-Erfahrung für sinnvoll?“
- Übernommen: ADR-Entwurf von ChatGPT mit Kontext, zwei Alternativen, Entscheidung und Konsequenzen
- Geändert/verstanden: Vorerfahrung beider Teammitglieder selbst ergänzt; Nuxt erzeugt Routen anhand der Seitendateien, bei unserer Wahl werden sie ausdrücklich definiert; Rendering-Strategien bleiben für Schritt 2 offen
#
- Prompt: „Wie lässt sich die Ordnerstruktur aus B praktisch anlegen? Welche Möglichkeiten bieten PowerShell und Git Bash, und wie können Platzhalterdateien vorbereitet werden?“
- Übernommen: PowerShell-Befehle zum Anlegen der Ordner und Platzhalterdateien entsprechend B; vorhandene Dateien werden übersprungen
- Geändert/verstanden: .gitkeep ist nicht nötig, sobald Dateien im Ordner liegen; TypeScript-Dateien können zunächst Kommentare enthalten, Vue-Dateien bekommen einen gültigen Template-Block; die Struktur enthält damit noch keine fertigen Funktionen
#
- Prompt: „Woran könnte der Fehler bei der Installation von Vue Router liegen? Passen die verwendeten Node- und npm-Versionen zu den Anforderungen der Abhängigkeiten?“
- Übernommen: Unterstützung bei der Fehlersuche; zunächst Installation mit einer anderen npm-Version, anschließend Anpassung der Node-Version wegen Versionsanforderungen der Abhängigkeiten
- Geändert/verstanden: Erfolgreiche Installation und unterstützte Laufzeitversion sind getrennt zu prüfen; Node auf Version 24 umgestellt und die installierte Vue-Router-Version kontrolliert
#
- Prompt: „Wie sollten Routing, Layout-Komponenten und Datenzugriff im Grundgerüst zusammenspielen? Was wäre ein einfacher Funktionsnachweis für die eingelesene JSON-Datei gemäß Aufgabe E?“
- Übernommen: Codevorschläge von ChatGPT für Routenkonfiguration, RouterLink und RouterView, Layout-Komponenten, Platzhalterseiten und schreibgeschützten Zugriff auf die JSON-Datei
- Geändert/verstanden: App.vue verbindet den gemeinsamen Seitenrahmen mit der aktuellen View; die angezeigten 20 Sessions dienen als Daten-Nachweis für E; Detailseiten zeigen vorerst nur IDs, Suche und Programmauswahl folgen später
#
- Prompt: „Welche Informationen gehören deiner Meinung nach in die README unseres aktuellen Projektstands? Wie sollten Installation, Entwicklungsserver, Build und geplante Funktionen dokumentiert werden?“
- Übernommen: README-Entwurf von ChatGPT mit Voraussetzungen, Installation, Entwicklungsserver, Build, Routen, Projektstruktur und geplantem Funktionsumfang
- Geändert/verstanden: Bereits vorhandene und erst geplante Funktionen werden getrennt beschrieben; npm run dev startet die Entwicklungsumgebung, npm run build prüft TypeScript und erstellt den Build
#
- Prompt: „Ist es sinnvoll, die Änderungen aus E auf einem eigenen Branch zu committen und anschließend in main zu übernehmen? Welche Schritte sind dafür nötig, und wie sollte ich mit dem vorhandenen Stash umgehen?“
- Übernommen: Git-Bash-Anleitung für die Dateiauswahl, den E-Commit auf feat/project-scaffold, den Push und den anschließenden Merge in das aktualisierte main
- Geändert/verstanden: git stash apply behält den Stash nach dem Wiederherstellen als lokale Sicherung; er wird nicht mitgepusht und muss nicht erneut angewendet werden; bei Konflikten kann der Merge zunächst abgebrochen werden