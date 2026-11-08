# AI-LOG Lechner

**Verwendetes Tool:** ChatGPT (Codex)


---

### Router-Umbau für SSG verstehen

**Prompt:**
> Can I replace the router file as shown, or could that break other parts of the application?

**Zweck:** Ich habe mir erklären lassen, welche Teile der Anwendung vom Router abhängen und wie `vite-ssg` die vorhandenen Routen verwendet.

**Ergebnis:** Die Prüfung hat gezeigt, dass die bestehenden Pfade, Routennamen und ID-Props zu den Views passen. Ich habe verstanden, warum ich den Export der Routendefinitionen und den Einstiegspunkt in `main.ts` zusammen umstellen muss.

---

### Installation und Build nachvollziehen

**Prompt:**
> Did the npm commands work correctly? Do other people need to run those setup commands when they clone the project?

**Zweck:** Ich habe mir den Unterschied zwischen der einmaligen Einrichtung von `vite-ssg` und der Installation nach dem Klonen erklären lassen.

**Ergebnis:** Die Abhängigkeit steht in `package.json`, die konkrete Version in `package-lock.json`. Beim Klonen installiert `npm ci` die Abhängigkeiten anhand der Lockdatei. `npm run build` verwendet das bereits hinterlegte Build-Skript.

---

### Sessionübersicht und Rendering prüfen

**Prompt:**
> Is Part B complete with the updated README? Does the implementation match the rendering strategy we chose?

**Zweck:** Ich wollte nachvollziehen, woran ich erkenne, dass die Übersicht statisch erzeugt wird und die Filter wie vorgesehen im Browser greifen.

**Ergebnis:** Die erzeugte HTML-Datei enthält alle 20 Sessions. Nach dem Mounten liest die App Track, Konferenztag und Level aus der URL und kombiniert die Filter mit UND. Bei der Prüfung fiel auch auf, dass die Routentabelle in der README noch eine ältere Beschreibung enthielt.

---

### Push, Pull Request und Merge unterscheiden

**Prompt:**
> What does a pull request do after I have already pushed my branch? Does the assignment require one, and where can I see whether my teammate requested a review?

**Zweck:** Ich habe mir erklären lassen, wann mein Commit auf GitHub verfügbar ist und wann er tatsächlich in `main` landet.

**Ergebnis:** Ein Push veröffentlicht den Stand eines Branches. Ein Pull Request zeigt die vorgeschlagenen Änderungen und bietet einen Ort für das Review. Der Merge übernimmt die Änderungen in den Zielbranch. Ich habe außerdem gelernt, wo ich offene Pull Requests und Review-Anfragen finde.

---

### Branches vergleichen und Git-Ausgaben verstehen

**Prompt:**
> How can I check whether my teammate’s branch and my branch change the same files? Why is the diff between `origin/main` and `main` empty even though my feature branch contains changes?

**Zweck:** Ich wollte vor dem Merge mögliche Überschneidungen erkennen und verstehen, welche Stände meine Git-Befehle vergleichen.

**Ergebnis:** Der Vergleich zeigte für die geprüften Branch-Stände keine gemeinsam geänderten Dateien. `git diff --name-only origin/main..main` vergleicht den zuletzt bekannten GitHub-Stand von `main` mit dem lokalen `main`. Auf meinem Feature-Branch zeigt der Vergleich mit `HEAD`, welche Dateien mein aktueller Commit gegenüber `origin/main` ändert.

---

### Statisch erzeugte Speakerprofile kontrollieren

**Prompt:**
> What does `find dist/speakers -maxdepth 1 -type f -name 'sp*.html' | wc -l` do? Could it have changed anything in my repository?

**Zweck:** Ich habe mir erklären lassen, wie ich die beim Build erzeugten Profilseiten zähle und warum dabei zwei Befehle verbunden werden.

**Ergebnis:** `find` sucht direkt im Ausgabeordner nach passenden HTML-Dateien. Die Pipe gibt die Treffer an `wc -l` weiter, das die Zeilen zählt. Beide Schritte lesen lediglich die Ausgabe des Builds. Für Teil D erwarte ich 18 Profilseiten.

---

### README mit dem Projektstand abgleichen

**Prompt:**
> Does the README reflect the current implementation, and did my teammate document his changes there?

**Zweck:** Ich wollte prüfen, welche Beschreibungen noch aus dem Grundgerüst stammen und welche Funktionen bereits umgesetzt sind.

**Ergebnis:** Die README enthielt bereits die Sessionfilter und die Speaker-Routen. Die Session-Detailseiten und „Mein Couch-Programm“ waren dort noch als Platzhalter beschrieben. Die Änderungen meines Kollegen zu diesen beiden Teilen waren im Code, in der Rendering-ADR und in seinem AI-Log sichtbar.