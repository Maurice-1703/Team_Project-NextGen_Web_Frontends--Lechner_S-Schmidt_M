import { readonly } from 'vue'
import rawData from '../assets/data/conference-data.json'
import type { ConferenceData, Session } from '../types/conference'

// JSON-Importe liefern für diese Felder zunächst den Typ string.
// Die Prüfung stellt sicher, dass nur unsere erlaubten Werte vorkommen.
const sessions: Session[] = rawData.sessions.map((session) => {
  const { level, format } = session

  if (
    level !== 'Einsteiger' &&
    level !== 'Fortgeschritten' &&
    level !== 'Experte'
  ) {
    throw new Error(`Unbekanntes Level bei ${session.id}: ${level}`)
  }

  if (
    format !== 'Vortrag' &&
    format !== 'Workshop' &&
    format !== 'Podium'
  ) {
    throw new Error(`Unbekanntes Format bei ${session.id}: ${format}`)
  }

  return { ...session, level, format }
})

// Einmal bereitstellen; alle Aufrufe verwenden dieselben Daten.
const data = readonly<ConferenceData>({ ...rawData, sessions })

// Filteroptionen aus dem tatsächlichen Datensatz ableiten.
const days = readonly(
  [...new Set(data.sessions.map((session) => session.day))].sort(),
)

const levels = readonly(
  [...new Set(data.sessions.map((session) => session.level))],
)

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