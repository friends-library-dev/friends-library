"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber, _a) {
    var lang = _a.lang;
    if (line === '' || line.length < 5 || lang === 'es') {
        return [];
    }
    // prettier-ignore
    var words = [
        ['satan', 'Satan'],
    ];
    var results = [];
    words.forEach(function (_a) {
        var _b = __read(_a, 2), lower = _b[0], corrected = _b[1];
        var find = new RegExp("\\b" + lower + "\\b", 'g');
        var match = line.match(find);
        if (match) {
            results.push({
                line: lineNumber,
                column: line.indexOf(lower) + 1,
                type: 'error',
                rule: rule.slug,
                fixable: true,
                message: "\"" + corrected + "\" should be capitalized everywhere in all editions",
                recommendation: line.replace(find, corrected),
            });
        }
    });
    return results;
};
rule.slug = 'capitalize';
exports.default = rule;
