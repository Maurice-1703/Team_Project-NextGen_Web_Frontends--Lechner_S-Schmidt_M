# AI-LOG Schmidt

**Verwendetes Tool:** Claude

**Claude-Instruktion:** 
- Maurice will selbst lernen: bei Programmieraufgaben lieber Hinweise, Leitfragen und Review statt fertiger Lösungen, außer er verlangt ausdrücklich alles. Fehler zuerst erklären, dann beheben.
- Er muss alles erklären können (Peer-Review, Prüfung, AI-LOG.md). Begriffe präzise (ref, aufrufen, befüllen, computed berechnet), das Warum mitliefern ("..., weil sonst ..."), Konsequenzen konkret (was sieht der Nutzer, was passiert nach Reload). Er hat nur Vorerfahrungen in Basic HTML, CSS, JavaScript, deswegen Begriffe aus der Frontendentwicklung möglichst immer miterklären.

---

### 19.11.2026 - Caching-Strategien wiederholen

**Prompt:**
> Erkläre ausführlich die Caching-Strategien, damit wir darauf aufbauend uns für eine Strategie je Datentyp entscheiden können

**Zweck:** Ich wollte die Caching-Strategien noch einmal wiederholen und verstehen, sodass ich sie selbst erklären und auf unser Szenario anwenden kann.

**Ergebnis:** Erklärdatei, mit Beispielen aus dem Projekt versehen

---

### 19.11.2026 - Strategie-Wahl verschriftlichen

**Prompt:**
> Schreibe uns das Konzept-Dokument für Schritt B basierend auf den bisherig getroffenen Entscheidungen

**Zweck:** Nachdem wir die Strategie gemeinsam festgelegt hatten, wollte ich einen Entwurf, der das vorgegebene Schema und die Wortgrenzen einhält, als Grundlage für unsere eigene Fassung

**Ergebnis:** Entwurf für Konzept-Dokument, mit Sam besprochen und Teile abgeändert

---

### 19.11.2026 - Startplan für A und C
 
**Prompt:**
> Unsere Aufteilung ist: 1. Maurice: A (PWA-Grundgerüst), C (Umsetzung) für App-Shell, D (Entscheidungsprotokoll) Entwurf 2. Sam: C (Umsetzung) für Daten, D (Entscheidungsprotokoll) Ergänzung, E (Nachweis). Womit und wie kann ich konkret starten?
 
**Zweck:** Ich wollte eine Schritt-für-Schritt-Anleitung für meinen Teil, mit Prüfpunkten und Commit-Vorschlägen
 
**Ergebnis:** Anleitung mit acht Schritten, Gerüst mit Lücken für die Config und Leitfragen zu den Werten
 
---
 
### 19.11.2026 - Begriffe und Fehlermeldungen beim Setup
 
**Prompts:**
> Was bedeutet Workbox
 
> [Ausgabe von `npm install -D vite-plugin-pwa` mit Warnungen zu `glob` und 4 moderate vulnerabilities]
 
> Was ist das Maskable Icon
 
**Zweck:** Ich wollte die Begriffe verstehen und die Warnungen und Fehler beim Einrichten richtig einordnen
 
**Ergebnis:** Workbox ist die Bibliothek, die `vite-plugin-pwa` intern nutzt; die Warnungen betreffen nur den Build, `npm audit fix --force` würde das Plugin auf eine alte Version zurückstufen; Erklärung maskable Icon mit Sicherheitszone

---
 
### 19.11.2026 - Workbox-Muster
 
**Prompts:**
> Zeige mir beispielhaft wie man ein Datentypeintrag für workbox anlegt
 
> [Screenshot meiner Glob-Muster: `"*.html"`, `"assets/*.{js, css}"`]
 
**Zweck:** Ich wollte ein Beispiel für einen `globPatterns`-Eintrag, um den App-Shell-Eintrag selbst zu schreiben
 
**Ergebnis:** Beispiel-Eintrag für statische Assets mit Erklärung der Glob-Syntax; im eigenen Eintrag Fehler gefunden (Leerzeichen in `{js, css}` hätte die CSS-Datei aus dem Precache ausgeschlossen)