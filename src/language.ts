// Based on https://github.com/mewo2/naming-language

import { sample, randInt } from 'variety'
import { Language, PhonemeMap } from './types'
import { PRNG } from 'variety/dist/types'

const tokenize = (input: string, rng: PRNG) => {
  const regex = /([a-zA-Z])(\([01]?\.\d+\)|\?)?/g
  const tokens = []
  let match
  while ((match = regex.exec(input))) {
    if (match[2]) {
      const t =
        match[2] === '?'
          ? 0.5
          : parseFloat(match[2].substring(1, match[2].length - 1))
      if (rng() >= t) continue
    }

    tokens.push(match[1])
  }

  return tokens
}

export const defaultOrthography = {
  ʃ: 'sh',
  ʒ: 'zh',
  ʧ: 'ch',
  ʤ: 'j',
  ŋ: 'ng',
  j: 'y',
  x: 'kh',
  ɣ: 'gh',
  ʔ: '‘',
  A: 'á',
  E: 'é',
  I: 'í',
  O: 'ó',
  U: 'ú',
}

export const makeSyllable = (lang: Language, rng: PRNG) => {
  while (true) {
    const syllable = (tokenize(lang.structure, rng) as (keyof PhonemeMap)[])
      .map<string>((type: keyof PhonemeMap) =>
        sample(lang.phonemes[type] || '', rng)
      )
      .join('')

    if (lang.restricts.syllables.some(regex => regex.test(syllable))) continue

    return syllable
  }
}

export const toSpelling = (lang: Language, syllable: string) =>
  syllable
    .split('')
    .map(sound => lang.orthography[sound] || sound)
    .join('')

export const makeWord = (lang: Language, rng: PRNG) => {
  const count = randInt(lang.minSyllables, lang.maxSyllables + 1, rng)

  const syllables = []
  while (syllables.length < count) {
    const syllable = makeSyllable(lang, rng)
    syllables.push(toSpelling(lang, syllable))
  }

  return syllables.join('')
}
