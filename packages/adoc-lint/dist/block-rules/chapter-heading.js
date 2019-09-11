"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (block) {
    var lines = block.split('\n');
    var chapterHeadings = lines.reduce(function (acc, line, index) {
        if (line && line.substring(0, 3) === '== ' && line.match(/^== +[^\s\n]/)) {
            acc.push(index + 1);
        }
        return acc;
    }, []);
    if (chapterHeadings.length === 1) {
        return [];
    }
    if (chapterHeadings.length === 0) {
        return [
            {
                line: 1,
                column: false,
                type: 'error',
                rule: rule.slug,
                message: 'Every file must have exactly one chapter level heading `== `',
                fixable: false,
            },
        ];
    }
    return chapterHeadings.slice(1).map(function (line) { return ({
        line: line,
        column: false,
        type: 'error',
        rule: rule.slug,
        message: "Duplicate chapter heading `== ` -- see line " + chapterHeadings[0],
        fixable: false,
    }); });
};
rule.slug = 'chapter-heading';
exports.default = rule;
