"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line === '') {
        return [];
    }
    if (line[0] !== '=' && line[0] !== '>' && line[0] !== '<') {
        return [];
    }
    if (!line.match(/^(=======|<<<<<<<|>>>>>>>)/)) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: false,
            type: 'error',
            rule: rule.slug,
            message: 'Git conflict markers must be removed.',
        },
    ];
};
rule.slug = 'git-conflict-markers';
exports.default = rule;
