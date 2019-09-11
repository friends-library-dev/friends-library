"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line[0] !== '[' || line[1] !== '.' || line[line.length - 1] !== ']') {
        return [];
    }
    if (!line.includes('.chapter-synopsis')) {
        return [];
    }
    var index = lineNumber;
    var nextLine = lines[index];
    var results = [];
    while (nextLine) {
        if (!nextLine.match(/^\* [^ ]/) && !nextLine.match(/^\/\//)) {
            results.push({
                line: index + 1,
                column: 1,
                type: 'error',
                rule: rule.slug,
                message: 'Chapter synopsis list items must begin with exactly `* `',
                recommendation: nextLine
                    .replace(/^\*+/, '')
                    .replace(/^ +/, '')
                    .replace(/^/, '* '),
                fixable: false,
            });
        }
        index++;
        nextLine = lines[index];
    }
    return results;
};
rule.slug = 'chapter-synopsis-list-item';
exports.default = rule;
