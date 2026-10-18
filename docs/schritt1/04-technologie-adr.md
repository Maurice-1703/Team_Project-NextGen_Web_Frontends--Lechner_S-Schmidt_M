# ADR D: Technologieentscheidung für das Projekt-Setup

## Kontext

Für CouchCoding bauen wir eine Konferenzplattform mit Session- und Speakerübersichten, Detailseiten und einem persönlichen Programm. Die Daten stammen aus einer statischen `conference-data.json`; ein eigenes Backend und ein Login sind nicht vorgesehen. Das Projekt entsteht zu zweit und soll später um Theme-Wechsel und Offline-Verfügbarkeit erweitert werden. Im Repository besteht bereits ein Grundsetup mit Vue 3, TypeScript und Vite. Entscheidend sind für uns der Routing-Bedarf, die Einarbeitung im Team und die Erweiterbarkeit.

## Optionen

### Vue 3 mit Vite und Vue Router

Vue übernimmt die Komponenten, Vite den Entwicklungsserver und den Build. Die Routen werden ausdrücklich in `router/index.ts` definiert. Damit lassen sich Übersicht, Detailseiten mit IDs und „Mein Couch-Programm“ einzelnen Views zuordnen. Die Konfiguration und die Imports bleiben direkt nachvollziehbar. Für die sechs vorgesehenen Views ist der manuelle Aufwand überschaubar. Dafür müssen wir Routen, Navigation und Fehlerseiten selbst miteinander verbinden.

### Nuxt

Nuxt baut ebenfalls auf Vue auf und erzeugt Routen anhand der Dateien im Seitenordner. Automatische Imports und vorgegebene Projektkonventionen nehmen uns Konfigurationsarbeit ab. Dafür müssten wir das bestehende Setup umstellen und uns zusätzlich mit diesen Konventionen beschäftigen. Bei vielen Seiten wäre die automatische Routenerzeugung hilfreich; bei unserem Umfang ist die manuelle Zuordnung noch gut zu pflegen.

## Entscheidung

Wir wählen Vue 3 mit TypeScript, Vite und Vue Router. Der Routing-Bedarf ist damit abgedeckt. Mit Vue 3, TypeScript und Vite haben wir beide in den bisherigen Hausübungen gearbeitet; das war ein weiterer Grund für diesen Stack. Neu ist für uns nur Vue Router, deshalb konzentriert sich die Einarbeitung darauf. Dafür verwenden wir den Vue Router Guide, insbesondere Routenkonfiguration, dynamische Parameter, `RouterLink`, `RouterView` und Query-Parameter. Für die Zusammenarbeit sind ausdrücklich definierte Routen und Imports gut überprüfbar.

Das State-Management aus C bleibt bei einem gemeinsamen Vue-Store mit `localStorage`. Die Design-Tokens aus A werden über globale CSS-Imports eingebunden.

## Konsequenzen

Die in B beschriebene Ordnerstruktur setzt auf diesem Setup auf; `router/index.ts` und die Views aus B ergeben sich direkt aus der Wahl von Vue Router.. Gemeinsame Komponenten und Composables bleiben weitgehend unabhängig von der Routenkonfiguration; nur useSessionFilter() nutzt bewusst die Query-Parameter des Routers, damit Filter beim Neuladen und beim Teilen eines Links erhalten bleiben (siehe B). Neue Views müssen wir jedoch selbst registrieren und ihre Verlinkung prüfen. TypeScript-Prüfung und Build laufen über das vorhandene `npm run build` mit `vue-tsc` und Vite. Die spätere PWA-Erweiterung braucht zusätzliche Einrichtung. Rendering-Strategien werden gesondert in Schritt 2 entschieden.

## Quellen

- [Vue Router Guide](https://router.vuejs.org/guide/)
- [Nuxt: Routing und automatische Imports](https://learn.nuxt.com/en/concepts/routing)
- [Vite: Getting Started](https://vite.dev/guide/)
- [Vue: TypeScript und Tooling](https://vuejs.org/guide/typescript/overview)
