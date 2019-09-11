"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '' || !line.includes('--')) {
        return [];
    }
    var nextLine = lines[lineNumber] || '';
    var combined = "" + line + (nextLine ? "\n" + nextLine : '');
    var match = combined.match(/--(\n)?_[^_]/);
    if (!match) {
        return [];
    }
    var isMultiLine = typeof match[1] !== 'undefined';
    return [
        {
            line: lineNumber + (isMultiLine ? 1 : 0),
            column: isMultiLine ? 1 : (match.index || 0) + 3,
            type: 'error',
            rule: rule.slug,
            recommendation: (isMultiLine ? nextLine : line).replace(/_/g, '__'),
            message: 'Must use double-underscore italics when preceded by double-dash (emdash)',
        },
    ];
};
rule.slug = 'emdash-touching-italics';
exports.default = rule;
