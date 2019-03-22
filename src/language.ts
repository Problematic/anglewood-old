// Based on https://github.com/mewo2/naming-language

import { sample, randInt, sampleWeighted } from 'variety'
import { Language, PhonemeMap } from './types'
import { PRNG, WeightedChoice } from 'variety/dist/types'

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

    if (lang.restricts.some(regex => regex.test(syllable))) {
      console.log('discarding restricted syllable', syllable)
      continue
    }

    return syllable
  }
}

const makeMorpheme = (lang: Language, key: string, rng: PRNG) => {
  if (!lang.morphemes) {
    lang.morphemes = { generic: [] }
  }
  if (!lang.morphemes[key]) {
    lang.morphemes[key] = []
  }

  const newGeneric = Symbol('new generic morpheme')
  const newKey = Symbol('new key morpheme')

  const selections: WeightedChoice<string | symbol>[] = [
    ...lang.morphemes['generic'].map<WeightedChoice<string>>(m => [m, 1.0]),
    ...lang.morphemes[key].map<WeightedChoice<string>>(m => [m, 1.0]),
    [newGeneric, 10.0],
    [newKey, 1.0],
  ]

  while (true) {
    const choice = sampleWeighted(selections, rng)

    if (typeof choice === 'symbol') {
      const syllable = makeSyllable(lang, rng)

      for (let k of Object.keys(lang.morphemes)) {
        if (lang.morphemes[k].includes(syllable)) continue
      }

      lang.morphemes[choice === newKey ? key : 'generic'].push(syllable)

      return syllable
    }

    return choice
  }
}

export const toSpelling = (lang: Language, syllable: string) =>
  syllable
    .split('')
    .map(sound => lang.orthography[sound] || sound)
    .join('')

export const makeWord = (lang: Language, key: string, rng: PRNG) => {
  const count = randInt(lang.minSyllables, lang.maxSyllables + 1, rng)

  while (true) {
    const syllables = []
    while (syllables.length < count) {
      const syllable = makeMorpheme(lang, key, rng)

      syllables.push(syllable)
    }

    const word = syllables.join('')

    if (lang.restricts.some(regex => regex.test(word))) {
      console.log('discarding restricted word', word)
      continue
    }

    return toSpelling(lang, word)
  }
}
