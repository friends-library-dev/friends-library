"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '' ||
        line[0] !== '[' ||
        line[line.length - 1] !== ']' ||
        lineNumber === 1) {
        return [];
    }
    if (line.indexOf(']') !== line.length - 1) {
        return [];
    }
    if (lines[lineNumber - 2] === '') {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: false,
            type: 'error',
            rule: rule.slug,
            message: 'Class/id designations (like `[.something]`) must be preceded by an empty line',
            fixable: true,
            recommendation: "--> add an empty line before line " + lineNumber,
        },
    ];
};
rule.slug = 'unspaced-class';
exports.default = rule;
