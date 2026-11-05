# AI-LOG Schmidt

**Verwendetes Tool:** Claude

**Claude-Instruktion:** 
- Maurice will selbst lernen: bei Programmieraufgaben lieber Hinweise, Leitfragen und Review statt fertiger Lösungen, außer er verlangt ausdrücklich alles. Fehler zuerst erklären, dann beheben.
- Er muss alles erklären können (Peer-Review, Prüfung, AI-LOG.md). Begriffe präzise (ref, aufrufen, befüllen, computed berechnet), das Warum mitliefern ("..., weil sonst ..."), Konsequenzen konkret (was sieht der Nutzer, was passiert nach Reload). Er hat nur Vorerfahrungen in Basic HTML, CSS, JavaScript, deswegen Begriffe aus der Frontendentwicklung möglichst immer miterklären.

---

### 05.11.2026 – Rendering-Strategien verstehen

**Prompt:**
> Kannst du nochmal sehr ausführlich CSR, SSR, SSG und ISR erklären und das auch in Bezug auf unser Szenario setzen?

**Zweck:** Ich wollte CSR, SSR, SSG und ISR so gut verstehen, dass ich sie selbst erklären und auf unser Szenario anwenden kann. Die Rückfragen zu einzelnen Begriffen (gecacht, DOM/Hydration, LCP) habe ich gestellt, weil ich sie in der Erklärung noch nicht verstanden hatte

**Ergebnis:** Erklärdatei, abgestimmt auf die Vorlesungsfolien; Ergänzungen zu Cache, DOM/virtuellem DOM und LCP

---

### 05.11.2026 – Entwurf Rendering-ADR

**Prompt:**
> Schreibe uns ein ADR für unsere Entscheidung "SSG mit vite-ssg, Rest CSR"

**Zweck:** Nachdem wir die Strategie gemeinsam festgelegt hatten, wollte ich einen Entwurf, der das vorgegebene Schema (Kontext → Optionen → Entscheidung → Konsequenzen) und die Wortgrenzen einhält, als Grundlage für unsere eigene Fassung

**Ergebnis:** ADR-Entwurf mit Einleitung und vier Entscheidungspunkten; Federführung danach selbst eingetragen (Sam: Speaker + Übersicht, ich: Detail + Mein Programm)

---

### 05.11.2026 – useConferenceData() und Typen

**Prompt:**
> Hilf uns bei der Erstellung des useConferenceData() und types/conference.ts

**Zweck:** Wir mussten useConferenceData() vor der Aufteilung gemeinsam fertigstellen. Ich wollte eine Anleitung mit Leitfragen statt einer fertigen Lösung, damit wir es selbst schreiben

**Ergebnis:** Anleitung mit Datensatz-Fakten, Gerüsten und Leitfragen

---

### 05.11.2026 – Review der Typen

**Prompt:**
> conference.ts zur Überprüfung geschickt

**Zweck:** Ich wollte prüfen lassen, ob unsere geschriebenen Typen in types/conference.ts vollständig und korrekt sind

**Ergebnis:** Typen kompilieren und decken den Datensatz ab; Hinweis auf den nächsten Stolperstein (JSON liefert level als string)

---

### 05.11.2026 – useConferenceData() verstehen

**Prompt:**
> Können wir unsere Version Schritt für Schritt gründlich durchgehen, weil ich sie noch nicht ganz verstehe

**Zweck:** Ich hatte die von Sam erstellte Version von useConferenceData() noch nicht vollständig verstanden und wollte sie so erklärt bekommen, dass ich sie selbst erklären und reviewen kann

**Ergebnis:** Erklärung in vier Teilen (Prüfung/Narrowing, readonly und Set, Suchfunktionen, Modulebene); Korrekturen zu meinen Antworten

---

### 05.11.2026 – Session-Detailseite

**Prompts:**
> Ich brauche mehr Unterstützung bei Schritt 2

> Was bedeuten die dl dt und dd tags

**Zweck:** Nach der Aufteilung (ich: Detailseiten und Mein Programm, Sam: Übersicht, Filter, Speaker) wollte ich eine Anleitung für meine Teile. Weil mir die Anleitung zu knapp war, habe ich um kleinere Schritte gebeten. Die Frage zu dl/dt/dd betraf HTML-Elemente aus dem Gerüst

**Ergebnis:** Anleitung; Detailseite in kleinen Schritten (computed für die Session, v-if/v-else, Track als Musterlösung für Raum)

---

### 05.11.2026 – RouterLink mit Parameter

**Prompt:**
> Wie genau baue ich die Route?

```html
<RouterLink :to="{ name: 'speakers/speaker.id'}">{{ speaker.name }}</RouterLink>
```

**Zweck:** Ich wollte meinen Zwischenstand prüfen lassen und habe gefragt, wie man einen RouterLink mit Parameter baut, weil mein Versuch nicht funktioniert hat

**Ergebnis:** Fehler erklärt (name ist der Routenname, params für :id); Detailseite für alle 20 Sessions und s99 serverseitig gerendert und geprüft

---

### 05.11.2026 – Konzept Store

**Prompt:**
> Was genau soll myProgram.ts eigentlich machen? Ich habe das Konzept von stores noch nicht ganz verstanden

**Zweck:** Ich hatte das Konzept von Stores noch nicht verstanden und wollte wissen, wozu myProgram.ts eigentlich da ist, bevor ich weiterbaue

**Ergebnis:** Erklärung (gemeinsamer Zustand, Prop Drilling, Abgrenzung zu useConferenceData); was passiert, wenn jede Komponente einen eigenen Store erzeugt

---

### 05.11.2026 – selectedSessions

**Prompt:**
> Machen wir mit selectedSessions weiter, ich benötige aber Hilfestellung

**Zweck:** Ich wollte das computed für die ausgewählten Sessions selbst schreiben, brauchte aber Hilfe

**Ergebnis:** Hilfestellung in drei Schritten (map, filter, sort); Fehler erklärt (Parameter vs. Rumpf der Pfeilfunktion, unnötiges ?., filter-Ergebnis nicht verwendet); Antwort zu führenden Nullen bestätigt

---

### 05.11.2026 – Store bereitstellen

**Prompt:**
> Machen wir weiter mit dem store

**Zweck:** Ich wollte den Store für alle Komponenten verfügbar machen und habe nachgefragt, weil ich Fabrik-Funktion, provide/inject und den Code mit InjectionKey nicht verstanden habe

---

### 05.11.2026 – AddToProgramButton

**Prompt:**
> Ich brauche Unterstützung beim Button

**Zweck:** Ich brauchte Hilfe beim Button zum Hinzufügen und Entfernen und beim Test, ob Button und Seite denselben Store nutzen

**Ergebnis:** toggle() und Template erklärt; Test erfolgreich (Auswahl erscheint in Mein Programm)

---

### 05.11.2026 – Speichern und Einlesen mit localStorage

**Prompt:**
> Machen wir weiter mit Speichern und Einlesen mit localStorage

**Zweck:** Die Auswahl in „Mein Programm“ sollte einen Reload überleben (Kernanforderung von Teil E). Ich wollte das in kleinen Schritten selbst umsetzen

**Ergebnis:** Anleitung in vier Stücken (save, parseStoredIds, init mit isReady-Sperre, onMounted in App.vue) mit Lücken und Testtabelle

---

### 05.11.2026 – Verständnisfragen zu localStorage

**Prompts:**
> Sag es mir (zur Leitfrage, warum save() gezielt aufgerufen wird statt mit watch)

> Was passiert dann? (zur Leitfrage, was ohne isReady-Sperre in localStorage steht)

**Zweck:** Ich wollte die Begründungen hinter den Entscheidungen im Store verstehen, um sie im Review erklären zu können

**Ergebnis:** watch würde auch beim Einlesen und bei Änderungen aus anderen Tabs speichern, die Tabs würden sich gegenseitig überschreiben; ohne Sperre überschreibt die leere Startliste die gespeicherte Auswahl

---

### 05.11.2026 – Abgleich zwischen Tabs

**Prompts:**
> Gib mir nun Hilfestellung beim Abgleich zwischen Tabs

**Zweck:** Änderungen in einem Tab sollten in anderen offenen Tabs sichtbar werden, ohne dass sich die Tabs gegenseitig überschreiben. Nach meinem Versuch habe ich mir die Lösung geben lassen, um sie nachzuvollziehen

**Ergebnis:** Erklärung des storage-Events; Fehler erklärt (Ergebnis von parseStoredIds nicht aufgefangen, push hängt das Event-Objekt an statt die Liste zu ersetzen); Lösung mit Erklärung jeder Zeile