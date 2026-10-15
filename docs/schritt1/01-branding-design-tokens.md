# Branding & Design Tokens: Freigeister

## Teamname und Markenkonzept

**Freigeister** ist eine satirische Konferenz-Plattform für die FrontendNow. Sie überzeichnet den Ton der Querdenker-Szene, wie er vor allem während der Corona-Pandemie laut wurde:

> Konferenz-Website für freidenkende Menschen – wir lassen uns von niemandem was sagen! Ein Ort, der alle einlädt, die über ihren Horizont hinaus denken wollen. Hier gibt es keine Tabus! #timmylebt

Von einer generischen Konferenz-Website unterscheidet uns, dass die Satire nicht nur im Slogan steckt, sondern in jeder Funktion. „Mein Programm“ heißt bei uns „Wir lassen uns keinen Zeitplan vorschreiben“, der Offline-Modus ist „unabhängig vom Mainstream-WLAN“, der Dark Mode heißt „Licht aus, Augen auf“ und die Filter fordern „Recherchier selbst!“. Die Inhalte selbst (Sessions, Speaker, Zeiten) bleiben korrekt und nüchtern, damit die App trotz Ironie benutzbar ist. Ein Hinweis im Footer kennzeichnet das Projekt als Satire.

Visuell trägt **Lila** die Marke (Buttons, Links, Fokus), **Orange** ist der Alarm-Akzent für „Achtung!“-Momente wie Badges oder die gerade laufende Session. Die Logo-Idee ist die Wortmarke „Freigeister!“ mit einem kleinen Aluhut über dem i.

## Tokens-Architektur

Die Tokens liegen als CSS Custom Properties in [`/tokens/tokens.css`](../../tokens/tokens.css) und sind in zwei Ebenen getrennt:

1. **Primitive** enthalten nur Rohwerte und tragen den Farbnamen im Token (`--lila-600`, `--plum-950`). Farb-Primitive werden nie direkt in Komponenten verwendet, sondern nur innerhalb von `tokens.css` als Wert der semantischen Tokens.
2. **Semantische Tokens** beschreiben den Zweck (`--color-surface`, `--color-text-primary`, `--color-accent`) und verweisen auf Primitive. Für Farben werden in Komponenten nur sie benutzt.

Die strenge Trennung gilt nur für Farben, weil sich nur diese zwischen Light und Dark ändern. Spacing, Typografie und Radien (`--space-4`, `--font-size-lg`, `--radius-md`) sind in jedem Theme gleich und werden deshalb direkt in Komponenten verwendet.

Wir haben uns aus drei Gründen für diese Trennung entschieden:

- **Theming-Erweiterbarkeit:** Ein Theme ist nur eine neue Zuweisung der semantischen Tokens. Der Dark Mode besteht deshalb aus einem einzigen Block unter `[data-theme="dark"]` bzw. `prefers-color-scheme: dark`, ohne dass eine Komponente angepasst wird. Weitere Themes (z. B. Hochkontrast) folgen demselben Muster.
- **Wartbarkeit:** Ändert sich ein Farbton, wird genau ein Primitive angepasst. Ändert sich eine Rolle (z. B. Links sollen dunkler werden), wird genau eine Zuweisung geändert. Komponenten-Code bleibt in beiden Fällen unberührt.
- **Konsistenz:** Weil Komponenten nur aus einer begrenzten Menge an Rollen, Spacing-Stufen und Schriftgrößen wählen können, entstehen keine Einzelwerte wie „13px Abstand“ oder ein vierter Lila-Ton. Das 4-px-Raster und die Typo-Skala halten Layouts über alle Seiten gleichmäßig.
- **Barrierefreiheit:** Kontraste werden einmal pro semantischem Paar geprüft und gelten dann überall, wo die Rolle verwendet wird.

## Farbpalette und Kontrastprüfung

Alle Text/Hintergrund-Paare erfüllen WCAG 2.1 AA (mindestens 4.5:1 für Text, 3:1 für Bedienelemente). Die Werte sind nach der WCAG-2.1-Formel berechnet und mit dem WebAIM Contrast Checker gegengeprüft.

| Paar | Light | Dark |
| --- | --- | --- |
| `text-primary` auf `bg` | 17.9:1 | 16.1:1 |
| `text-secondary` auf `bg` | 7.4:1 | 9.4:1 |
| `on-accent` auf `accent` | 7.1:1 | 10.3:1 |
| `link` auf `bg` | 8.5:1 | 10.3:1 |
| `on-alert` auf `alert` | 6.8:1 | 8.4:1 |
| `alert-text` auf `bg` | 6.9:1 | 11.2:1 |
| `danger` auf `bg` | 6.1:1 | 10.0:1 |
| `success` auf `bg` | 6.2:1 | 10.3:1 |
| `border-strong` auf `bg` (UI) | 4.7:1 | 3.8:1 |

Wie von WCAG 1.4.1 verlangt, trägt Farbe trotzdem nie allein eine Information: Badges haben Text, Fehler zusätzlich ein Icon.

## Typografie- und Spacing-Skala

- **Schriften:** Fraunces für Überschriften (Flugblatt-Pathos, das die Satire trägt), Inter für Fließtext und UI, JetBrains Mono für Uhrzeiten und Räume. Alle werden selbst gehostet, damit sie offline verfügbar sind.
- **Typo-Skala:** Basis 16px, Faktor 1.25: 12 / 14 / 16 / 20 / 25 / 31 / 39px (`--font-size-xs` bis `--font-size-3xl`).
- **Spacing:** 4px-Raster: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px (`--space-1` bis `--space-16`).
- **Radius:** 4 / 8 / 16px und `full` für Chips.
- **Schatten:** im Light Theme ein weicher Kartenschatten, im Dark Theme keiner; dort trennt `--color-surface-raised` die Ebenen.