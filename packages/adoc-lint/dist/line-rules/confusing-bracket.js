"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line[0] !== '[' || line[line.length - 1] !== ']') {
        return [];
    }
    if (!line.startsWith('[.book-title]')) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: false,
            type: 'error',
            rule: rule.slug,
            message: 'Line-ending bracket needs to be escaped because the line starts with a [.book-title]',
            recommendation: line.replace(/\]$/, '+++]+++'),
        },
    ];
};
rule.slug = 'confusing-bracket';
exports.default = rule;
