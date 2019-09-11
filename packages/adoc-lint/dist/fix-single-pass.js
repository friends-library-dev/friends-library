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
function fix(adoc, lints) {
    var numUnfixedFixables = 0;
    var modifiedLines = new Set();
    var lines = adoc.split('\n');
    lints.forEach(function (lint) {
        if (!lint.fixable || typeof lint.recommendation !== 'string') {
            return;
        }
        var recommendation = lint.recommendation, rule = lint.rule;
        if (modifiedLines.has(lint.line)) {
            numUnfixedFixables++;
            return;
        }
        if (rule === 'open-block') {
            lines[lint.line - 1] = "\n" + lines[lint.line - 1];
            modifiedLines.add(lint.line);
            return;
        }
        if (rule === 'unspaced-class') {
            lines[lint.line - 1] = "\n" + (lines[lint.line - 1] || '');
            modifiedLines.add(lint.line);
            return;
        }
        if (rule === 'multiple-blank-lines') {
            var remove = recommendation
                .replace(/[^\d,]/g, '')
                .split(',')
                .map(Number);
            remove.forEach(function (lineNumber) {
                if (!modifiedLines.has(lineNumber)) {
                    lines[lineNumber - 1] = null;
                    modifiedLines.add(lineNumber);
                }
            });
            return;
        }
        if (rule === 'trailing-hyphen' ||
            rule === 'dangling-possessive' ||
            (rule === 'join-words' && recommendation.includes('\n'))) {
            if (modifiedLines.has(lint.line + 1)) {
                numUnfixedFixables++;
            }
            else {
                var _a = __read(recommendation.split('\n'), 2), first = _a[0], second = _a[1];
                lines[lint.line - 1] = first;
                lines[lint.line] = second;
                modifiedLines.add(lint.line);
                modifiedLines.add(lint.line + 1);
            }
            return;
        }
        if (rule === 'eof-newline') {
            lines.push('');
            return;
        }
        lines[lint.line - 1] = recommendation;
        modifiedLines.add(lint.line);
    });
    return [lines.filter(function (l) { return l !== null; }).join('\n'), numUnfixedFixables];
}
exports.default = fix;
