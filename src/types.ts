export interface PhonemeMap {
  C: string
  V: string
  S?: string
  L?: string
  F?: string
}

export interface Language {
  structure: string
  restricts: {
    syllables: RegExp[]
    words: RegExp[]
  }
  phonemes: PhonemeMap
  orthography: Record<string, string>
  minSyllables: number
  maxSyllables: number
}
