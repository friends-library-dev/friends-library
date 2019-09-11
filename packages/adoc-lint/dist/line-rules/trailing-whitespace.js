"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (!line.length || line[line.length - 1] !== ' ') {
        return [];
    }
    var match = line.match(/ +$/);
    if (!match || match.index === undefined) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: match.index + 1,
            rule: rule.slug,
            type: 'error',
            message: 'Lines should not have trailing whitespace',
            recommendation: line.replace(/ +$/, ''),
            fixable: true,
        },
    ];
};
rule.slug = 'trailing-whitespace';
exports.default = rule;
