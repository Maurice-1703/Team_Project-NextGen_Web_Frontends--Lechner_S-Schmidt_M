import { readonly } from 'vue'
import conferenceData from '../assets/data/conference-data.json'

// Gemeinsamen Datensatz schreibgeschützt bereitstellen.
const data = readonly(conferenceData)

export function useConferenceData() {
  return data
}