"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var rule = function (line, lines, lineNumber) {
    if (!line.length || line[0] !== ' ') {
        return [];
    }
    if (utils_1.isFootnotePoetryLine(line, lines, lineNumber)) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: 0,
            rule: rule.slug,
            type: 'error',
            message: 'Lines should not have leading whitespace',
            recommendation: line.replace(/^ +/, ''),
            fixable: true,
        },
    ];
};
rule.slug = 'leading-whitespace';
exports.default = rule;
