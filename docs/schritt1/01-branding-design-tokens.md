# Branding & Design Tokens: CouchCoding

## Teamname und Markenkonzept

**CouchCoding** ist die Konferenz-Plattform für alle, die FrontendNow gemütlich von der Couch oder aus dem Bett verfolgen wollen. Coden soll Spaß machen, und zwei Konferenztage sollen sich nach einer vollen Arbeitswoche nicht wie Pflicht anfühlen, sondern wie eine Einladung: Decke holen, warmes Getränk in die Hand, Vorträge genießen.

Von einer generischen Konferenz-Website unterscheidet uns, dass wir nicht nur Zuhörer bedienen, sondern zum Mitmachen einladen. Wer sich seinen Zeitplan zusammenstellt, plant aktiv mit („Mein Couch-Programm“). Der Offline-Modus sorgt dafür, dass das Programm auch dann da ist, wenn das WLAN im Schlafzimmer schwächelt. Der Dark Mode ist der „Leselampen-Modus“ für den Abend. Ton und Gestaltung sind warm, ruhig und freundlich, ohne Hektik und ohne Marketing-Lärm.

Visuell steht **Flieder** für Ruhe und trägt die Marke (Buttons, Links, Fokus). **Orange** ist das warme Licht einer Leselampe und hebt Wichtiges hervor, etwa die gerade laufende Session. Hintergründe sind cremefarben statt kaltweiß, im Dark Mode ein dunkles Aubergine statt Schwarz. Radien sind bewusst weich, wie Kissen.

## Tokens-Architektur

Die Tokens liegen als CSS Custom Properties in [`/tokens/tokens.css`](../../tokens/tokens.css) und sind in zwei Ebenen getrennt:

1. **Primitive** enthalten nur Rohwerte und tragen den Farbnamen im Token (`--flieder-600`, `--cocoa-950`). Farb-Primitive werden nie direkt in Komponenten verwendet, sondern nur innerhalb von `tokens.css` als Wert der semantischen Tokens.
2. **Semantische Tokens** beschreiben den Zweck (`--color-surface`, `--color-text-primary`, `--color-accent`) und verweisen auf Primitive. Für Farben werden in Komponenten nur sie benutzt.

Die strenge Trennung gilt nur für Farben, weil sich nur diese zwischen Light und Dark ändern. Spacing, Typografie und Radien (`--space-4`, `--font-size-lg`, `--radius-md`) sind in jedem Theme gleich und werden deshalb direkt in Komponenten verwendet.

Gründe für diese Architektur:

- **Theming-Erweiterbarkeit:** Ein Theme ist nur eine neue Zuweisung der semantischen Tokens. Der Dark Mode ist ein einziger Block unter `[data-theme="dark"]` bzw. `prefers-color-scheme: dark`, ohne dass eine Komponente angepasst wird.
- **Wartbarkeit:** Ändert sich ein Farbton, wird genau ein Primitive angepasst. Ändert sich eine Rolle (z. B. Links sollen dunkler werden), wird genau eine Zuweisung geändert. Komponenten-Code bleibt in beiden Fällen unberührt.
- **Konsistenz:** Komponenten wählen nur aus einer begrenzten Menge an Rollen, Spacing-Stufen und Schriftgrößen. So entstehen keine Einzelwerte wie „13px Abstand“ oder ein dritter Flieder-Ton.
- **Barrierefreiheit:** Kontraste werden einmal pro semantischem Paar geprüft und gelten überall, wo die Rolle verwendet wird.

## Farbpalette und Kontrastprüfung

Alle Text/Hintergrund-Paare erfüllen WCAG 2.1 AA (mindestens 4.5:1 für Text, 3:1 für Bedienelemente). Die Werte sind nach der WCAG-2.1-Formel berechnet und im WebAIM Contrast Checker überprüfbar.

| Paar | Light | Dark |
| --- | --- | --- |
| `text-primary` auf `bg` | 16.9:1 | 15.4:1 |
| `text-secondary` auf `bg` | 7.0:1 | 9.4:1 |
| `on-accent` auf `accent` | 5.6:1 | 9.9:1 |
| `link` auf `bg` | 7.5:1 | 9.9:1 |
| `on-highlight` auf `highlight` | 7.3:1 | 9.0:1 |
| `highlight-text` auf `bg` | 6.1:1 | 11.3:1 |
| `danger` auf `bg` | 6.2:1 | 9.3:1 |
| `success` auf `bg` | 6.1:1 | 9.8:1 |
| `border-strong` auf `bg` (UI) | 4.4:1 | 3.8:1 |

Nach WCAG 1.4.1 trägt Farbe nie allein eine Information: Hervorhebungen haben Text, Fehler zusätzlich ein Icon.

## Typografie- und Spacing-Skala

- **Schriften:** Fraunces für Überschriften (weiche, freundliche Serifen), Inter für Fließtext und UI, JetBrains Mono für Uhrzeiten und Räume. Alle werden selbst gehostet, damit sie offline verfügbar sind.
- **Typo-Skala:** Basis 16px, Faktor 1.25: 12 / 14 / 16 / 20 / 25 / 31 / 39px.
- **Spacing:** 4px-Raster: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px.
- **Radius:** 6 / 12 / 20px und `full` für Chips.
- **Schatten:** im Light Theme ein weicher Kartenschatten, im Dark Theme keiner; dort trennt `--color-surface-raised` die Ebenen.