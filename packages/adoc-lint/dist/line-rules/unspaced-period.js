"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '') {
        return [];
    }
    var expr = /\.[A-Z][^.]/g;
    var match;
    var results = [];
    while ((match = expr.exec(line))) {
        results.push({
            line: lineNumber,
            column: match.index + 1,
            type: 'error',
            rule: rule.slug,
            message: 'unexpected unspaced period',
        });
    }
    return results;
};
rule.slug = 'unspaced-period';
exports.default = rule;
