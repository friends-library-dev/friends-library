"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegexLintRunner_1 = __importDefault(require("../RegexLintRunner"));
var runner = new RegexLintRunner_1.default([
    {
        test: 'amongst',
        search: /\b(A|a)mongst\b/g,
        replace: '$1mong',
        fixable: true,
    },
    {
        test: 'spake',
        search: /\b(S|s)pake\b/g,
        replace: '$1poke',
        fixable: true,
    },
    {
        test: 'methinks',
        search: /\b(M|m)ethinks\b/g,
        replace: 'I think',
        fixable: true,
    },
    {
        test: 'methought',
        search: /\b(M|m)ethought\b/g,
        replace: 'I thought',
        fixable: true,
    },
    {
        test: 'whoso',
        search: /\b(W|w)hoso\b/g,
        replace: '$1hoever',
        fixable: false,
    },
    {
        test: 'zionward',
        search: /\bZionward(s?)\b/g,
        replace: 'towards Zion',
        isMaybe: true,
        fixable: false,
    },
    {
        test: 'jollity',
        search: /\b(J|j)ollity\b/g,
        replace: function (_, firstLetter) { return (firstLetter === 'J' ? 'M' : 'm') + "erriment"; },
        fixable: false,
        message: '"<found>" should be replaced in modernized editions (merriment, revelry, mirth, gaiety, merrymaking, cheerfulness, etc.)',
    },
    {
        test: 'intercourse',
        search: /\b(I|i)ntercourse\b/g,
        recommend: false,
        fixable: false,
        message: '"<found>" should be replaced in modernized editions (communication, interaction, conversation, commerce, dealings, exchange, fellowship, communion, contact, correspondence, etc.)',
    },
    {
        test: 'ejaculat',
        search: /\b(E|e)jaculat(ed?|ions?|ing)\b/g,
        recommend: false,
        fixable: false,
        message: '"<found>" should be replaced in modernized editions (exclamation, cry, utterance, etc.)',
    },
], { langs: ['en'], editions: ['modernized'] });
var rule = function (line, lines, lineNumber, lintOptions) {
    if (lintOptions.lang !== 'en' || lintOptions.editionType !== 'modernized') {
        return [];
    }
    return runner.getLineLintResults(line, lineNumber, lintOptions);
};
rule.slug = 'modernize-words';
runner.rule = rule.slug;
exports.default = rule;
