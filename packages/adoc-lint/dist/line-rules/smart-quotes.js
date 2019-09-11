"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adoc_utils_1 = require("@friends-library/adoc-utils");
var rule = function (line, lines, lineNumber) {
    var fixed = adoc_utils_1.quotifyLine(line);
    if (fixed === line) {
        return [];
    }
    var column = null;
    line.split('').forEach(function (char, col) {
        if (column === null && char !== fixed[col]) {
            column = col;
        }
    });
    return [
        {
            line: lineNumber,
            type: 'error',
            column: column || 0,
            rule: rule.slug,
            message: 'Incorrect usage of smart quotes/apostrophes',
            recommendation: fixed,
            fixable: true,
        },
    ];
};
rule.slug = 'smart-quotes';
exports.default = rule;
