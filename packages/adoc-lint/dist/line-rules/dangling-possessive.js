"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '') {
        return [];
    }
    var nextLine = lines[lineNumber];
    if (!nextLine || nextLine[0] !== 's' || !line.match(/`'$/)) {
        return [];
    }
    if (!nextLine.match(/^s\b/)) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: line.length + 1,
            type: 'error',
            rule: rule.slug,
            message: 'Possessive broken over two lines (probably by conversion process)',
            recommendation: line + "s\n" + nextLine.replace(/^s/, '').trim(),
            fixable: true,
        },
    ];
};
rule.slug = 'dangling-possessive';
exports.default = rule;
