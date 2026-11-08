// Gemeinsame Session-Auswahl verwalten und in localStorage speichern
import { computed, inject, readonly, ref, type InjectionKey } from 'vue'
import { useConferenceData } from '../composables/useConferenceData'

// Schlüssel im localStorage, wie in Konzept C festgelegt
// v1 -> falls sich das Format später ändert, neuer Schlüssel statt kaputter alter Daten
const STORAGE_KEY = 'frontendnow:2026:my-program:v1'


// Fabrik-Funktion statt Zustand auf Modulebene
// jeder Aufruf erzeugt einen eigenen Store -> einmal pro App-Instanz (Konzept C)
// wichtig für SSG/SSR: persönlicher Zustand darf nicht zwischen Nutzern geteilt werden
export function createMyProgramStore() {
    const { getSessionById } = useConferenceData()

    // gespeicherte Auswahl: nur IDs, keine ganzen Session-Objekte (Konzept C)
    // ref -> Änderungen lösen automatisch Neuzeichnen aller abhängigen Komponenten aus
    const selectedIds = ref<string[]>([])


    // Fehlermeldung für den Nutzer, null = kein Fehler
    const storageError = ref<string | null>(null)

    // erst true, wenn die gespeicherte Auswahl eingelesen wurde
    // vorher keine Änderungen -> leere Startliste darf gespeicherte Daten nicht überschreiben
    const isReady = ref(false)


    // gespeicherten Text in eine saubere ID-Liste umwandeln
    // Rückgabe: Array = gültig (evtl. bereinigt), null = beschädigt
    function parseStoredIds(raw: string | null): string[] | null {
        // noch nie gespeichert -> leere Auswahl, kein Fehler
        if (raw === null) return []

        // Text in Daten umwandeln
        // unknown statt any -> TypeScript zwingt uns, den Inhalt erst zu prüfen
        let parsed: unknown
        try {
            parsed = JSON.parse(raw)
        } catch {
            // kein gültiges JSON, z. B. "kaputt"
            return null
        }

        // muss ein Array sein, z. B. nicht {} oder "s02"
        if (!Array.isArray(parsed)) return null


        const validIds = parsed.filter((value): value is string => typeof value === "string")    // nur Strings behalten
                            .filter((value) => getSessionById(value) !== undefined)              // nur IDs behalten, die es im Datensatz gibt
        return [...new Set(validIds)]   // Duplikate entfernen
    }

    // gespeicherte Auswahl einlesen, prüfen und übernehmen
    // wird nur im Browser nach dem Mounten aufgerufen (App.vue)
    function init(): void {
        // Lesen kann ebenfalls fehlschlagen (z. B. vom Browser blockiert)
        let raw: string | null = null
        try {
            raw = localStorage.getItem(STORAGE_KEY)
        } catch {
            storageError.value = 'Gespeicherte Auswahl konnte nicht gelesen werden.'
        }

        const ids = parseStoredIds(raw)

        if (ids === null) {
            // beschädigt -> leer starten und Hinweis zeigen (Konzept C)
            selectedIds.value = []
            storageError.value = 'Gespeicherte Auswahl war beschädigt und wurde zurückgesetzt.'
        } else {
            selectedIds.value = ids
        }

        // ab jetzt dürfen Änderungen gespeichert werden
        isReady.value = true

        // ab jetzt auf Änderungen aus anderen Tabs hören
        // erst hier (im Browser nach dem Mounten), weil es beim vite-ssg-Build kein window gibt
        window.addEventListener('storage', handleStorage)
    }

    // Änderung aus einem anderen Tab übernehmen
    // läuft nur in den anderen Tabs, nicht im Tab, der gespeichert hat
    // übernehmen ohne save() -> sonst schreiben sich Tabs gegenseitig hinterher (Konzept C)
    function handleStorage(event: StorageEvent): void {
        // nur reagieren, wenn unser Schlüssel betroffen ist
        // key === null -> anderer Tab hat localStorage komplett geleert (localStorage.clear())
        if (event.key !== STORAGE_KEY && event.key !== null) return

        // neuen Text prüfen und bereinigen -> dieselben Regeln wie beim Start
        const ids = parseStoredIds(event.newValue)

        // beschädigt -> ignorieren, aktuellen Stand behalten
        if (ids === null) return

        // komplette Liste aus dem anderen Tab übernehmen (ersetzen, nicht anhängen)
        selectedIds.value = ids
    }

    // aktuelle Auswahl als JSON-Text speichern
    // try/catch -> setItem kann fehlschlagen (Speicher voll, privater Modus, vom Browser blockiert)
    // bei Fehler: Auswahl bleibt im ref nutzbar, nur nicht dauerhaft gespeichert
    function save(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds.value))
            storageError.value = null
        } catch {
            storageError.value = 'Deine Auswahl konnte nicht gespeichert werden. Sie bleibt bis zum Schließen der Seite erhalten.'
        }
    }


    // prüfen, ob eine Session bereits ausgewählt ist
    function isSelected(id: string): boolean {
        return selectedIds.value.includes(id)
    }

    // Session hinzufügen
    // unbekannte ID -> ignorieren, damit nur gültige Sessions gespeichert werden
    // bereits ausgewählt -> ignorieren, damit keine Duplikate entstehen
    // neues Array statt push -> jede echte Änderung ist eine neue Liste, später leichter zu speichern
    function addSession(id: string): void {
        if (!isReady.value) return
        if (!getSessionById(id)) return
        if (isSelected(id)) return
        selectedIds.value = [...selectedIds.value, id]
        save()
    }

    // Session aus der Auswahl entfernen
    // filter behält nur IDs, die NICHT der zu entfernenden ID entsprechen
    // neues Array zuweisen -> ref meldet die Änderung, abhängige Komponenten zeichnen neu
    function removeSession(id: string): void {
        if (!isReady.value) return
        if (!isSelected(id)) return
        selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)
        save()
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
        isReady: readonly(isReady),
        storageError: readonly(storageError),
        init,
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