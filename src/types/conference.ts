export type SessionLevel = 'Einsteiger' | 'Fortgeschritten' | 'Experte'
export type SessionFormat = 'Vortrag' | 'Workshop' | 'Podium'

export interface Conference {
  readonly name: string
  readonly tagline: string
  readonly dates: readonly string[]
  readonly location: string
  readonly timezone: string
}

export interface Track {
  readonly id: string
  readonly name: string
}

export interface Room {
  readonly id: string
  readonly name: string
  readonly capacity: number
}

export interface Speaker {
  readonly id: string
  readonly name: string
  readonly title: string
  readonly company: string
  readonly bio: string
  readonly sessionIds: readonly string[]
}

export interface Session {
  readonly id: string
  readonly title: string
  readonly abstract: string
  readonly trackId: string
  readonly speakerIds: readonly string[]
  readonly day: string
  readonly startTime: string
  readonly endTime: string
  readonly roomId: string
  readonly level: SessionLevel
  readonly format: SessionFormat
}

export interface ConferenceData {
  readonly conference: Conference
  readonly tracks: readonly Track[]
  readonly rooms: readonly Room[]
  readonly speakers: readonly Speaker[]
  readonly sessions: readonly Session[]
}