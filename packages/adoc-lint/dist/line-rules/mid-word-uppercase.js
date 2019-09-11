"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var rule = function (line, lines, lineNumber) {
    if (line === '' || utils_1.isAsciidocBracketLine(line)) {
        return [];
    }
    var expr = /[a-z][A-Z]([a-z]|\b)/g;
    var match;
    var results = [];
    while ((match = expr.exec(line))) {
        if (isMc(match, line) || isLitV(match, line)) {
            continue;
        }
        results.push({
            line: lineNumber,
            column: match.index + 2,
            type: 'error',
            rule: rule.slug,
            message: 'Unexpected mid-word uppercase letter (probably a scan error)',
        });
    }
    return results;
};
rule.slug = 'mid-word-uppercase';
exports.default = rule;
function isMc(match, line) {
    if (match[0][0] !== 'c') {
        return false;
    }
    return !!line.substr(match.index - 2, 2).match(/Ma?$/);
}
function isLitV(match, line) {
    if (match[0] !== 'tV') {
        return false;
    }
    return !!line.substr(match.index - 3, 3).match(/\bLi$/);
}
