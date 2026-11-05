// Gemeinsame Session-Auswahl verwalten und in localStorage speichern
import { computed, inject, readonly, ref, type InjectionKey } from 'vue'
import { useConferenceData } from '../composables/useConferenceData'

// Fabrik-Funktion statt Zustand auf Modulebene
// jeder Aufruf erzeugt einen eigenen Store -> einmal pro App-Instanz (Konzept C)
// wichtig für SSG/SSR: persönlicher Zustand darf nicht zwischen Nutzern geteilt werden
export function createMyProgramStore() {
    const { getSessionById } = useConferenceData()

    // gespeicherte Auswahl: nur IDs, keine ganzen Session-Objekte (Konzept C)
    // ref -> Änderungen lösen automatisch Neuzeichnen aller abhängigen Komponenten aus
    const selectedIds = ref<string[]>([])

    // prüfen, ob eine Session bereits ausgewählt ist
    function isSelected(id: string): boolean {
        return selectedIds.value.includes(id)
    }

    // Session hinzufügen
    // unbekannte ID -> ignorieren, damit nur gültige Sessions gespeichert werden
    // bereits ausgewählt -> ignorieren, damit keine Duplikate entstehen
    // neues Array statt push -> jede echte Änderung ist eine neue Liste, später leichter zu speichern
    function addSession(id: string): void {
        if (!getSessionById(id)) return
        if (isSelected(id)) return
        selectedIds.value = [...selectedIds.value, id]
    }

    // Session aus der Auswahl entfernen
    // filter behält nur IDs, die NICHT der zu entfernenden ID entsprechen
    // neues Array zuweisen -> ref meldet die Änderung, abhängige Komponenten zeichnen neu
    function removeSession(id: string): void {
        selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)
    }

    // abgeleitete Liste: aus gespeicherten IDs die vollständigen Session-Objekte
    // computed -> rechnet automatisch neu, sobald sich selectedIds ändert
    const selectedSessions = computed(() => {
        // jede ID über die zentrale Datenschicht nachschlagen
        const sessions = selectedIds.value.map((id) => getSessionById(id))
            .filter((session) => session !== undefined)  // undefined entfernen -> nur gültige Sessions bleiben

         // nach Tag und Startzeit sortieren
         // ISO-Datum + HH:MM -> Textvergleich entspricht zeitlicher Reihenfolge
        return sessions.sort((a, b) => 
            (a.day+a.startTime).localeCompare(b.day+b.startTime)
        )
    })

    return {
        // readonly -> Komponenten dürfen lesen, aber nur über add/remove ändern
        selectedIds: readonly(selectedIds),
        isSelected,
        addSession,
        removeSession,
        selectedSessions
    }
}

// Typ des Stores (automatisch aus dem Rückgabewert der factory function abgeleitet)
// -> ändert sich Rückgabe, passt sich Typ von selbst an
export type MyProgramStore = ReturnType<typeof createMyProgramStore>

// eindeutiger Schlüssel für provide/inject
// Symbol statt String -> kann nicht versehentlich mit anderem Schlüssel kollidieren
// InjectionKey<...> -> inject weiß dadurch, welchen Typ es zurückbekommt
export const myProgramKey: InjectionKey<MyProgramStore> = Symbol('myProgram')

// Zugriff für Komponenten: holt den in App.vue bereitgestellten Store
// Komponenten rufen nur das auf, nie createMyProgramStore()
export function useMyProgram(): MyProgramStore {
  const store = inject(myProgramKey)
  // fehlt das provide -> sofort klarer Fehler statt später rätselhaftem undefined
  if (!store) {
    throw new Error('useMyProgram(): kein Store bereitgestellt (provide in App.vue fehlt)')
  }
  return store
}