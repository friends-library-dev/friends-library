"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
// @see https://books.google.com/ngrams for data backing up choices
var sets = [
    ['yoke', 'mate', ''],
    ['yoke', 'mates', ''],
    ['grave', 'yard', ''],
    ['every', 'where', ''],
    ['every', 'thing', ''],
    ['tender', 'spirited', '-'],
    ['choice', 'spirited', '-'],
    ['hard', 'hearted', '-'],
    ['hard', 'heartedness', '-'],
    ['honest', 'hearted', '-'],
    ['simple', 'hearted', '-'],
    ['faint', 'hearted', ''],
    ['upright', 'hearted', '-'],
    ['sincere', 'hearted', '-'],
    ['tender', 'hearted', '-'],
    ['tender', 'heartedness', '-'],
    ['stout', 'hearted', '-'],
    ['broken', 'hearted', ''],
    ['humble', 'hearted', '-'],
    ['true', 'hearted', '-'],
    ['heavy', 'hearted', '-'],
    ['dead', 'hearted', '-'],
    ['open', 'hearted', '-'],
    ['single', 'hearted', '-'],
    ['light', 'hearted', ''],
    ['fellow', 'laborers', '-'],
    ['fellow', 'labourers', '-'],
    ['fellow', 'laborer', '-'],
    ['fellow', 'labourer', '-'],
    ['fore', 'part', ''],
    ['for', 'ever', ''],
    ['for', 'evermore', ''],
    ['like', 'minded', '-'],
    ['feeble', 'minded', '-'],
    ['high', 'minded', '-'],
    ['honest', 'minded', '-'],
    ['humble', 'minded', '-'],
    ['tender', 'minded', '-'],
    ['well', 'minded', '-'],
    ['right', 'minded', '-'],
    ['carnal', 'minded', '-'],
    ['heavenly', 'minded', '-'],
    ['earthly', 'minded', '-'],
    ['lowly', 'minded', '-'],
    ['simple', 'minded', '-'],
    ['better', 'minded', '-'],
    ['religious', 'minded', '-'],
    ['upright', 'minded', '-'],
    ['liberal', 'minded', '-'],
    ['sober', 'minded', '-'],
    ['evil', 'minded', '-'],
    ['worldly', 'minded', '-'],
    ['noble', 'minded', '-'],
    ['single', 'minded', '-'],
    ['open', 'minded', '-'],
    ['loving', 'kindness', ''],
    ['well', 'behaved', '-'],
];
var firstParts = new RegExp("\\b" + sets.map(function (_a) {
    var _b = __read(_a, 1), first = _b[0];
    return escape_string_regexp_1.default(first);
}).join('|') + "\\b", 'i');
var rule = function (line, lines, lineNumber, _a) {
    var lang = _a.lang;
    if (lang === 'es' || line === '') {
        return [];
    }
    if (!line.match(firstParts)) {
        return [];
    }
    var results = [];
    sets.forEach(function (_a) {
        var _b = __read(_a, 3), first = _b[0], second = _b[1], joiner = _b[2];
        if (!line.match(new RegExp("\\b" + first + "\\b", 'i'))) {
            return;
        }
        var sameLine = new RegExp("\\b(" + first + ")( )(" + second + ")\\b", 'i');
        var match = line.match(sameLine);
        if (match && match.index !== undefined) {
            results.push(getLint(lineNumber, match.index + 1 + first.length, first, second, joiner, line.replace(sameLine, "$1" + joiner + "$3")));
            return;
        }
        var nextLine = lines[lineNumber];
        if (!nextLine || nextLine.indexOf(second) !== 0) {
            return;
        }
        var nextLineStart = new RegExp("^(" + second + ")\\b");
        if (!nextLine.match(nextLineStart)) {
            return;
        }
        var thisLineEnd = new RegExp("\\b(" + first + ")$", 'i');
        var lineEndMatch = line.match(thisLineEnd);
        if (!lineEndMatch || typeof lineEndMatch.index === 'undefined') {
            return;
        }
        var reco;
        if (line.length < nextLine.length) {
            reco = "" + line + joiner + second + "\n" + nextLine.replace(nextLineStart, '').trim();
        }
        else {
            reco = line.replace(thisLineEnd, '').trim() + "\n" + lineEndMatch[1] + joiner + nextLine;
        }
        results.push(getLint(lineNumber, lineEndMatch.index + 1, first, second, joiner, reco));
    });
    return results;
};
rule.slug = 'join-words';
exports.default = rule;
function getLint(line, column, first, second, joiner, recommendation) {
    return {
        line: line,
        column: column,
        type: 'error',
        rule: rule.slug,
        message: "\"" + first + " " + second + "\" should be combined to become \"" + first + joiner + second + "\"",
        fixable: true,
        recommendation: recommendation,
    };
}
