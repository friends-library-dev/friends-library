"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegexLintRunner_1 = __importDefault(require("../RegexLintRunner"));
var runner = new RegexLintRunner_1.default([
    {
        test: 'inclose',
        search: /\b(Un|un)?(I|i)nclose?/g,
        replace: function (_, un, i) {
            var str = (i === 'I' ? 'E' : 'e') + "nclose";
            if (un !== undefined) {
                return "" + un + str;
            }
            return str;
        },
    },
    {
        test: 'despatch',
        search: /\b(D|d)espatch/g,
        replace: '$1ispatch',
    },
    {
        test: 'cotempor',
        search: /\b(C|c)otempora/g,
        replace: '$1ontempora',
        message: '"cotemporary" should be replaced with "contemporary" in all editions',
    },
    {
        test: 'staid',
        search: /\b(S|s)taid\b/g,
        replace: '$1tayed',
    },
    {
        replace: 'Melchizedek',
        search: /\bMelchi(sedec|zedeck|sedek)\b/g,
        test: 'Melchi',
    },
    {
        test: 'connexion',
        search: /\b(C|c)onnexion(s)?\b/g,
        replace: '$1onnection$2',
    },
    {
        test: 'behove',
        search: /\b(B|b)ehove(s|d)?\b/g,
        replace: '$1ehoove$2',
    },
    {
        test: 'vail',
        search: /\bvail(s|ed)?\b/g,
        replace: 'veil$1',
    },
    {
        test: 'gaol',
        search: /\b(G|g)aol(er)?\b/g,
        replace: function (_, g, end) { return (g === 'G' ? 'J' : 'j') + "ail" + (end || ''); },
    },
    {
        test: 'burthen',
        search: /\b(B|b)urthen(s|some|ed)?\b/g,
        replace: '$1urden$2',
    },
    {
        test: 'stopt',
        search: /\b(S|s)topt\b/g,
        replace: '$1topped',
    },
    {
        test: 'slipt',
        search: /\b(S|s)lipt\b/g,
        replace: '$1lipped',
    },
    {
        test: 'Corah',
        search: /\bCorah\b/g,
        replace: 'Korah',
    },
    {
        test: 'Barbadoes',
        search: /\bBarbadoes\b/g,
        replace: 'Barbados',
    },
    {
        test: 'ilful',
        search: /\b(un)?(sk|w)ilful(ly|ness)\b/gi,
        replace: '$1$2illful$3',
    },
    {
        test: 'subtil',
        search: /\b(S|s)ubtil(ty|ly)?\b/g,
        replace: function (_, s, end) {
            if (!end)
                return s + "ubtle";
            if (end === 'ty')
                return s + "ubtlety";
            return s + "ubtly";
        },
    },
    {
        test: 'fulfil',
        search: /\b(F|f)ulfil\b/g,
        replace: '$1ulfill',
    },
    {
        test: 'hardheartedness',
        search: /\b(H|h)ardheartedness\b/g,
        replace: '$1ard-heartedness',
    },
    {
        test: 'sion',
        search: /\bSion(-?wards?)?\b/g,
        replace: function (_, end) { return "Zion" + (end ? end.replace(/^-/, '') : ''); },
    },
    {
        test: '\\bwo\\b',
        search: /\b(W|w)o\b/g,
        replace: '$1oe',
    },
    {
        test: 'bishoprick',
        search: /\b(B|b)ishoprick\b/g,
        replace: '$1ishopric',
    },
]);
var rule = function (line, lines, lineNumber, lintOptions) {
    if (lintOptions.lang !== 'en') {
        return [];
    }
    return runner.getLineLintResults(line, lineNumber, lintOptions);
};
rule.slug = 'obsolete-spellings';
runner.rule = rule.slug;
exports.default = rule;
