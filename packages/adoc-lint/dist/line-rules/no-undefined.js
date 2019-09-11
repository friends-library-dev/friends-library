"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '' || !line.includes('undefined')) {
        return [];
    }
    var column = line.indexOf('undefined') + 1;
    return [
        {
            line: lineNumber,
            column: column,
            type: 'error',
            rule: rule.slug,
            message: '`undefined` is usually a scripting error artifact and should be removed',
            fixable: false,
        },
    ];
};
rule.slug = 'no-undefined';
exports.default = rule;
