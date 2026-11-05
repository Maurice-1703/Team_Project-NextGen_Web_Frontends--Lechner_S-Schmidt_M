import { readonly } from 'vue'
import rawData from '../assets/data/conference-data.json'
import type { ConferenceData, Session } from '../types/conference'

// JSON-Importe liefern für diese Felder zunächst den Typ string
// Prüfung stellt sicher, dass nur unsere erlaubten Werte vorkommen
const sessions: Session[] = rawData.sessions.map((session) => {
  const { level, format } = session                                   // Destructuring (Kurzschreibweise für const level = session.level und const format = session.format)

  if (
    level !== 'Einsteiger' &&
    level !== 'Fortgeschritten' &&
    level !== 'Experte'
  ) {
    throw new Error(`Unbekanntes Level bei ${session.id}: ${level}`)  // Build scheitert bei vite-ssg
  }

  if (
    format !== 'Vortrag' &&
    format !== 'Workshop' &&
    format !== 'Podium'
  ) {
    throw new Error(`Unbekanntes Format bei ${session.id}: ${format}`)
  }

  return { ...session, level, format }      // level, format als Kurzform für level: level, format: format (überschreiben die kopierten Felder mit den eingeengten Variablen, die TypeScript jetzt als richtige Typen kennt -> Narrowing)
})

// Einmal bereitstellen; alle Aufrufe verwenden dieselben Daten
const data = readonly<ConferenceData>({ ...rawData, sessions })   // sessions durch geprüfte Sessions ersetzen


// Filteroptionen aus dem tatsächlichen Datensatz ableiten
// new Set() -> speichert jeden Wert nur einmal
// [...set] -> Spread Operator wandelt Set wieder in normales Array um
const days = readonly(
  [...new Set(data.sessions.map((session) => session.day))].sort(),
)

const levels = readonly(
  [...new Set(data.sessions.map((session) => session.level))],
)

// Suchfunktionen: .find() geht Array von vorne durch und gibt erstes Element zurück, für das die Bedingung 'true' ergibt
function getSessionById(id: string) {
  return data.sessions.find((session) => session.id === id)
}

function getSpeakerById(id: string) {
  return data.speakers.find((speaker) => speaker.id === id)
}

function getTrackById(id: string) {
  return data.tracks.find((track) => track.id === id)
}

function getRoomById(id: string) {
  return data.rooms.find((room) => room.id === id)
}

// .filter() gibt alle passenden Elemente als neues Array zurück
function getSessionsBySpeakerId(speakerId: string) {
  return data.sessions.filter((session) =>
    session.speakerIds.includes(speakerId),
  )
}

function getSpeakersBySessionId(sessionId: string) {
  const session = getSessionById(sessionId)

  if (!session) return []

  return data.speakers.filter((speaker) =>
    session.speakerIds.includes(speaker.id),
  )
}

// Zentrale Datenschicht für alle Views und Komponenten
// Prüfung, Filteroptionen und Suchfunktionen laufen nur einmal beim ersten Import (Modulebene)
// Funktion selbst gibt nur Verweise auf dieselben schreibgeschützten Daten zurück
// Dadurch alle Aufrufer mit identischen Objekten statt eigener Kopien
// Funktion statt direktem Export: einheitlich mit anderen Composables, Datenquelle später austauschbar
export function useConferenceData() {
  return {
    ...data,
    days,
    levels,
    getSessionById,
    getSpeakerById,
    getTrackById,
    getRoomById,
    getSessionsBySpeakerId,
    getSpeakersBySessionId,
  }
}