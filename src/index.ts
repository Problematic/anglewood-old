import anglewood from 'commander'
import seedrandom from 'seedrandom'
import { makeWord } from './language'
import { Language } from './types'

anglewood
  .version('0.1.0')
  .option('--seed <seed>', 'specify prng seed value')
  .parse(process.argv)

const rng = seedrandom(anglewood.seed || Date.now())

const languages = {
  gwylln: {
    structure: 'CVV?C?F?',
    restricts: [/(.)\1/i, /[ʃfs][hpdrR]/, /([lɬ]{2})/],
    phonemes: {
      C: 'bcdfghlLmnprRsSx',
      V: 'aAeioOuyw',
      F: 'nD',
    },
    orthography: {
      A: 'â',
      O: 'ô',
      R: 'rh',
      L: 'll',
      S: 'si',
      f: 'ph',
      D: 'dd',
      x: 'ch',
      ʔ: '‘',
      N: 'ng',
    },
    minSyllables: 2,
    maxSyllables: 2,
  } as Language,
}

const lang = languages.gwylln
const places = Array.from(Array(10).keys()).map(_ =>
  makeWord(lang, 'place', rng)
)

console.log(lang.morphemes)

console.log(places.join(' / '))
