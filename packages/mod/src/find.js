// @flow
import type { MatchLocation } from './type';
import { ucfirst } from '../../kite/src/publish/text';

export default {
  hath: replace('hath', 'has'),
  doth: replace('doth', 'does'),
  thy: replace('thy', 'your'),
  thyself: replace('thyself', 'yourself'),
  thee: replace('thee', 'you'),
  dost: replace('dost', 'do'),
  nay: replace('nay', 'no'),
  yea: replace('yea', 'yes'),
  wouldst: replace('wouldst', 'would'),
  doest: replace('doest', 'do'),
  etc: replace('&c.', 'etc.'),

  saith: replace('saith', 'says'),
  saidst: replace('saidst', 'said'),
  hadst: replace('hadst', 'had'),
  wast: replace('wast', 'were'),
  whilst: replace('whilst', 'while'),
  betwixt: replace('betwixt', 'between'),
  whither: replace('whither', 'where'),
  thither: replace('thither', 'there'),
  hither: replace('hither', 'here'),
  sion: replace('sion', 'Zion'),
  gaol: replace('gaol', 'jail'),
  wilt: replace('wilt', 'will'),
  hast: replace('hast', 'have'),
  couldst: replace('couldst', 'could'),
  antichristian: replace('antichristian', 'anti-christian'),
  mayest: replace('mayest', 'may'),
  mayst: replace('mayst', 'may'),
  burthen: replace('burthen', 'burden'),
  shalt: replace('shalt', 'shall'),
  'us-ward': replace('us-ward', 'us'),
  physic: replace('physic', 'medicine'),
  victuals: replace('victuals', 'food'),
  ere: replace('ere', 'before'),

  conversation: prompt('conversation', ['conduct', 'behaviour', 'manner of life', 'citizenship']),
  thou: prompt('thou', ['you']),
  ye: prompt('ye', ['you']),
  art: prompt('art', ['are', 'foobar']),
  thine: prompt('thine', ['your', 'yours']),
  apace: prompt('apace', ['quickly']),
  withal: prompt('withal', ['with']),
  own: prompt('own', ['acknowledge', 'affirm']),
  whence: prompt('whence', ['where', 'which', 'from which', 'thus']),
  thence: prompt('thence', ['there', 'from there']),
};

function prompt(old: string, replacements: Array<string>): (line: string) => Array<MatchLocation> {
  return word(old, replacements, true);
}

function replace(old: string, replacement: string): (line: string) => Array<MatchLocation> {
  return word(old, [replacement], false);
}

function word(
  old: string,
  replacements: Array<string>,
  ask: boolean = true,
): (line: string) => Array<MatchLocation> {
  return (line: string): Array<MatchLocation> => {
    if (line.match(/^\[.*\]$/)) {
      return [];
    }

    const exp = new RegExp(`\\b${old}\\b`, 'gi');
    let match;
    const locs = [];
    while ((match = exp.exec(line))) {
      locs.push({
        start: match.index,
        end: match.index + match[0].length,
        match: match[0],
        replace: matchCapitalization(replacements, match[0]),
        prompt: ask,
      });
    }
    return locs;
  };
}

function matchCapitalization(strings: Array<string>, found: string): Array<string> {
  if (found.match(/^[A-Z]/)) {
    return strings.map(ucfirst);
  }

  return strings;
}


// wert
// wilt
// art
// doest
// wouldst
