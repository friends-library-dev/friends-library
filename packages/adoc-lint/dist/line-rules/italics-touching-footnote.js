"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '' || !line.includes('_')) {
        return [];
    }
    var match = line.match(/[^_]_(\^|footnote:\[)/);
    if (!match) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: (match.index || 0) + 2,
            type: 'error',
            fixable: false,
            rule: rule.slug,
            recommendation: line.replace(/_/g, '__'),
            message: 'Italics touching footnote markers must use double underscores',
        },
    ];
};
rule.slug = 'italics-touching-footnote';
exports.default = rule;
