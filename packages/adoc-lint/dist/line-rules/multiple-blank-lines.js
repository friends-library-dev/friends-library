"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line !== '') {
        return [];
    }
    var prevLine = lines[lineNumber - 2];
    if (typeof prevLine === 'undefined' || prevLine !== '') {
        return [];
    }
    // we only flag the LAST line of a multi-line violation
    var nextLine = lines[lineNumber];
    if (nextLine === '') {
        return [];
    }
    var remove = [];
    var offset = 2;
    var current = lines[lineNumber - offset];
    while (current === '') {
        offset++;
        remove.push(lineNumber - offset + 2);
        current = lines[lineNumber - offset];
    }
    return [
        {
            line: lineNumber,
            column: false,
            type: 'error',
            rule: rule.slug,
            message: 'Multiple blank lines are not allowed',
            fixable: true,
            recommendation: "--> remove preceding line/s: (" + remove.sort().join(',') + ")",
        },
    ];
};
rule.slug = 'multiple-blank-lines';
exports.default = rule;
