"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '' || line[0] !== '[' || line[line.length - 1] !== ']') {
        return [];
    }
    var match = line.match(/^\[[^ []+(\.)\]$/);
    if (!match) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: line.length - 1,
            type: 'error',
            rule: rule.slug,
            message: 'empty classname (periods must be followed by something or omitted)',
            fixable: false,
            recommendation: line.replace(/\.\]$/, ']'),
        },
    ];
};
rule.slug = 'empty-role';
exports.default = rule;
