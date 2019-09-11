"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var rule = function (line, lines, lineNumber) {
    if (line === '' || line.indexOf('  ') === -1) {
        return [];
    }
    if (utils_1.isFootnotePoetryLine(line, lines, lineNumber)) {
        return [];
    }
    var expr = / {2,}/g;
    var match;
    var results = [];
    while ((match = expr.exec(line))) {
        var isLeading = match.index === 0;
        var isTrailing = match.index + match[0].length === line.length;
        if (isLeading || isTrailing) {
            continue;
        }
        // will be caught by `invalid-heading` rule
        if (results.length === 0 && line.substring(0, match.index + 1).match(/^===?=? $/)) {
            continue;
        }
        results.push(getLint(match.index + 2, line, lineNumber));
    }
    return results;
};
function getLint(column, line, lineNumber) {
    return {
        line: lineNumber,
        column: column,
        type: 'error',
        rule: rule.slug,
        message: 'Consecutive spaces are not allowed',
        recommendation: line.replace(/ {2,}/g, ' '),
        fixable: true,
    };
}
rule.slug = 'consecutive-spaces';
exports.default = rule;
