"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '' || line[line.length - 1] !== '-' || line[line.length - 2] === '-') {
        return [];
    }
    // footnote poetry stanza marker
    if (line.indexOf('     - - - -') === 0) {
        return [];
    }
    var recommendation = getRecommendation(line, lines[lineNumber]);
    return [
        __assign({ line: lineNumber, column: line.length, type: 'error', rule: rule.slug, message: 'Lines may not end with a hyphen' }, (recommendation === false ? {} : { recommendation: recommendation, fixable: true })),
    ];
};
function getRecommendation(line, next) {
    if (!next) {
        return false;
    }
    if (!line.includes(' ') || !next.includes(' ')) {
        return false;
    }
    if (next.indexOf('//') === 0 || next[0] === '-') {
        return false;
    }
    if (line.length <= next.length) {
        var nextWords = next.split(' ');
        var nextFirst = nextWords.shift();
        return "" + line + nextFirst + "\n" + nextWords.join(' ');
    }
    var lineWords = line.split(' ');
    var lineLast = lineWords.pop();
    return lineWords.join(' ') + "\n" + lineLast + next;
}
rule.slug = 'trailing-hyphen';
exports.default = rule;
