"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var rule = function (line, lines, lineNumber) {
    if (line === '' || !line.includes('_') || utils_1.isAsciidocBracketLine(line)) {
        return [];
    }
    var match = line.match(/[^_ \n+#([`]_[a-zA-Z]/);
    if (!match) {
        return [];
    }
    var column = (match.index || 0) + 2;
    var restOfLine = line.substring(column);
    // don't flag italicizing within a word like `sun_light_`
    if (restOfLine.match(/[a-z0-9]+_/)) {
        return [];
    }
    return [
        {
            line: lineNumber,
            column: column,
            type: 'error',
            rule: rule.slug,
            message: 'Unexpected underscore',
        },
    ];
};
rule.slug = 'unexpected-underscore';
exports.default = rule;
