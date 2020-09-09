import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  if (
    line === `` ||
    lintOptions.editionType !== `modernized` ||
    lintOptions.lang !== `en` ||
    !line.match(/\byou\b/i)
  ) {
    return [];
  }

  let compositeLine = line;
  if (lines[lineNumber] && lines[lineNumber] !== ``) {
    compositeLine += ` ${lines[lineNumber].split(` `).shift() || ``}`;
  }

  const lints: LintResult[] = [];
  const regex = /\byou\b ([a-z]+s)\b/g;

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(compositeLine))) {
    if (!WHITELIST[match[1].toLowerCase()]) {
      let column = (match.index || 0) + 4 + match[1].length;
      if (column > line.length) {
        column = (match.index || 0) + 1;
      }
      lints.push({
        line: lineNumber,
        column,
        type: `error`,
        rule: rule.slug,
        message: `verb/person mismatch from modernization should be fixed`,
        recommendation: line.replace(match[0], match[0].replace(/s$/, ``)),
      });
    }
  }

  return lints;
};

rule.slug = `person-mismatch`;

export default rule;

const WHITELIST: Record<string, number> = {
  express: 1,
  as: 1,
  has: 1,
  miss: 1,
  overseers: 1,
  travailers: 1,
  helpers: 1,
  descendents: 1,
  induces: 1,
  across: 1,
  springs: 1,
  arises: 1,
  press: 1,
  profess: 1,
  confess: 1,
  scandalous: 1,
  rebellious: 1,
  gracious: 1,
  covetous: 1,
  wages: 1,
  yours: 1,
  thanks: 1,
  afterwards: 1,
  fees: 1,
  suspicious: 1,
  kiss: 1,
  numerous: 1,
  his: 1,
  is: 1,
  its: 1,
  does: 1,
  yourselves: 1,
  this: 1,
  pass: 1,
  thus: 1,
  leads: 1,
  runs: 1,
  vineyards: 1,
  proofs: 1,
  heavens: 1,
  harmless: 1,
  blameless: 1,
  faultless: 1,
  comfortless: 1,
  sensations: 1,
  doubtless: 1,
  workers: 1,
  always: 1,
  riches: 1,
  previous: 1,
  righteous: 1,
  careless: 1,
  cedars: 1,
  mountains: 1,
  access: 1,
  happiness: 1,
  monks: 1,
  was: 1,
  towards: 1,
  lies: 1,
  belongs: 1,
  onwards: 1,
  spirits: 1,
  causes: 1,
  ends: 1,
  us: 1,
  things: 1,
  vessels: 1,
  treacherous: 1,
  magistrates: 1,
  bishops: 1,
  beginners: 1,
  deceivers: 1,
  physicians: 1,
  scribes: 1,
  kings: 1,
  witnesses: 1,
  companions: 1,
  builders: 1,
  pleaders: 1,
  sharers: 1,
  ministers: 1,
  adulterers: 1,
  fighters: 1,
  handmaids: 1,
  chiefs: 1,
  fools: 1,
  partakers: 1,
  prisoners: 1,
  oppressors: 1,
  oppress: 1,
  judges: 1,
  burghers: 1,
  hypocrites: 1,
  lambs: 1,
  rulers: 1,
  princes: 1,
  teachers: 1,
  convictions: 1,
  priests: 1,
  saints: 1,
  hirelings: 1,
  witness: 1,
  followers: 1,
  lawyers: 1,
  professors: 1,
  zealous: 1,
  sons: 1,
  offences: 1,
  stoners: 1,
  inhabitants: 1,
  bless: 1,
  pilgrims: 1,
  parents: 1,
  pastors: 1,
  daughters: 1,
  nobles: 1,
  perhaps: 1,
  fanatics: 1,
  jurors: 1,
  hints: 1,
  mourners: 1,
  affects: 1,
  transgress: 1,
  travellers: 1,
  guiltless: 1,
  oaks: 1,
  deceits: 1,
  families: 1,
  kindness: 1,
  prodigals: 1,
  unless: 1,
  glorious: 1,
  friends: 1,
  elders: 1,
  posessors: 1,
  stones: 1,
  darkness: 1,
  stars: 1,
  fishes: 1,
  answers: 1,
  gates: 1,
  eyes: 1,
  fathers: 1,
  mothers: 1,
  widows: 1,
  hearts: 1,
  possess: 1,
  honors: 1,
  priors: 1,
  cardinals: 1,
  sometimes: 1,
  drunkenness: 1,
  servants: 1,
  amends: 1,
  comes: 1,
  tenders: 1,
  comforts: 1,
};
