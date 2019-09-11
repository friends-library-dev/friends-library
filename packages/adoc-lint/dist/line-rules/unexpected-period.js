"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var roman_numerals_1 = require("roman-numerals");
var rule = function (line, lines, lineNumber) {
    if (line === '') {
        return [];
    }
    var expr = /[a-z]\.(?<!\betc\.)(?<!\bviz\.)(?<!\b(V|v)ol\.)(?<!\bch\.)(?<!\b8vo\.)(?<!\bfol\.)(?<!\bsect\.)(?<!\bedit\.)(?<!\b\d+(d|s)\.)(?<!\bchap\.)(?<!\bp\.) [a-z]/g;
    var match;
    var results = [];
    while ((match = expr.exec(line))) {
        if (isIe(match, line) || isPmOrAm(match, line) || isRomanNumeral(match, line)) {
            continue;
        }
        results.push({
            line: lineNumber,
            column: match.index + 2,
            type: 'error',
            rule: rule.slug,
            message: 'Unexpected period',
        });
    }
    return results;
};
rule.slug = 'unexpected-period';
rule.maybe = true;
exports.default = rule;
function isRomanNumeral(match, line) {
    var lastWord = line
        .substring(0, match.index)
        .split(' ')
        .pop();
    try {
        var num = roman_numerals_1.toArabic(lastWord || '');
        if (typeof num === 'number') {
            return true;
        }
    }
    catch (_a) { }
    return false;
}
function isIe(match, line) {
    var firstLetter = match[0][0];
    if (firstLetter === 'i') {
        return !!match[0].match(/i\. ?e/);
    }
    if (firstLetter !== 'e') {
        return false;
    }
    return !!previousCharacters(line, match, 9).match(/i\+?\+?\+?\.\+?\+?\+? ?/);
}
function isPmOrAm(match, line) {
    var firstLetter = match[0][0].toLowerCase();
    if (['a', 'p'].includes(firstLetter)) {
        return !!match[0].match(/(p|a)\. ?m/i);
    }
    if (firstLetter !== 'm') {
        return false;
    }
    return !!previousCharacters(line, match, 3).match(/(a|p)\. ?/i);
}
function previousCharacters(line, match, number) {
    return line.substr(Math.max(match.index - number, 0), Math.min(match.index, number));
}
