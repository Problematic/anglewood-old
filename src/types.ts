export interface PhonemeMap {
  C: string
  V: string
  S?: string
  L?: string
  F?: string
}

export interface Language {
  structure: string
  restricts: RegExp[]
  phonemes: PhonemeMap
  orthography: Record<string, string>
  minSyllables: number
  maxSyllables: number
  morphemes?: { [key: string]: string[] }
}
