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
    structure: 'S(0.35)CVV?C',
    restricts: {
      syllables: [/(.)\1/, /[ʃfs][hpd]/],
      words: [],
    },
    phonemes: {
      C: 'dglhprRmnɬx',
      V: 'aeiouyw',
      S: 'sʃ',
    },
    orthography: {
      R: 'rh',
      ɬ: 'll',
      ʃ: 'si',
      f: 'ph',
      ð: 'dd',
      x: 'ch',
      ʔ: '‘',
    },
    minSyllables: 1,
    maxSyllables: 2,
  } as Language,
}

const lang = languages.gwylln
const words = Array.from(Array(10).keys()).map(_ => makeWord(lang, rng))

console.log(words.join(' / '))
