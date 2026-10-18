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