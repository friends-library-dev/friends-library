"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var rule = function (line, lines, lineNumber) {
    if (line === '' ||
        line === '{footnote-paragraph-split}' ||
        utils_1.isAsciidocBracketLine(line)) {
        return [];
    }
    var expr = /[a-z][0-9&£$%*(={}°\\/[\]](?!hellip;)([a-zA-Z ]|\b)/g;
    var match;
    var results = [];
    while ((match = expr.exec(line))) {
        if (match[0].endsWith('] ') || match[0].endsWith('* ')) {
            continue;
        }
        results.push({
            line: lineNumber,
            column: match.index + 2,
            type: 'error',
            rule: rule.slug,
            message: 'Unexpected mid-word non-letter (probably a scan error)',
        });
    }
    return results;
};
rule.slug = 'mid-word-non-letter';
exports.default = rule;
