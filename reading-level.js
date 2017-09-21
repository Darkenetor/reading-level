const syllable = require('syllable')
const Tokenizer = require('sentence-tokenizer')

exports.readingLevel = (text, full) => {

  const tokenizer = new Tokenizer('ChuckNorris')
  tokenizer.setEntry(text)
  
  const sentences = tokenizer.getSentences()
  
  const tracker = {
    syllables: 0,
    words: 0
  }

  const counts = sentences.reduce((obj, sentence) => {
    
    // strip all puncuation and numbers from the sentences
    const words = sentence
                    .replace(/[^\w\s]|_/g, "")
                    .replace(/\s+/g, " ")
                    .replace(/[0-9]/g, '')
                    .split(' ')
                    .filter(letter => letter)

    obj.words += words.length
    
    // count up all the syllables
    obj.syllables += words.reduce((total, word) => total += syllable(word), 0)

    return obj

  }, tracker)

  const { words, syllables } = counts

  const first = words / sentences.length
  const second = syllables / words

  const obj = {
    sentences: sentences.length,
    words,
    syllables,
    unrounded: 0.39 * first + 11.8 * second - 15.59, 
  }

  obj.rounded = Math.round(isNaN(obj.unrounded) ? NaN : obj.unrounded)

  const err = 'Either no sentences or words, please enter valid text'

  if (isNaN(obj.rounded)) {
    obj.error = err
  }

  if (full === 'full') {
    return obj
  }

  if (isNaN(obj.rounded)) {
    return err
  }

  return obj.rounded
}