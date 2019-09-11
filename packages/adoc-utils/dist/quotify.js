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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
function quotify(adoc) {
    return adoc
        .split('\n')
        .map(quotifyLine)
        .join('\n');
}
exports.quotify = quotify;
function quotifyLine(line) {
    if (line === "'''") {
        return line;
    }
    if (line.match(/^\[.+\]$/)) {
        return line;
    }
    var match;
    var chars = line.split('');
    var mod = __spread(chars);
    var expr = /"|'/g;
    while ((match = expr.exec(line))) {
        var type = match[0];
        var index = match.index;
        var before = line.substring(0, index);
        var after = line.substring(index + 1);
        var charBefore = before[index - 1];
        var charAfter = after[0];
        if (charBefore === BACKTICK || charAfter === BACKTICK) {
            continue;
        }
        // beginning of line? point right
        if (index === 0) {
            mod[0] = right(type);
            continue;
        }
        // in the middle of a word like `don't`? point left
        if (charBefore &&
            charBefore.match(/[a-z0-9]/i) &&
            (charAfter && charAfter.match(/[a-z,;:.]/i))) {
            // continue; // comment out to segregate possessive fixes
            mod[index] = left(type);
            continue;
        }
        // if there is a space before it, always point it right
        if (charBefore === ' ') {
            mod[index] = right(type);
            continue;
        }
        // if there is a space after it, always point left
        if (charAfter === ' ') {
            mod[index] = left(type);
            continue;
        }
        // at the end of the line? point left
        if (index === line.length - 1) {
            mod[index] = left(type);
            continue;
        }
        if (['?', '.', ','].includes(charBefore)) {
            mod[index] = left(type);
            continue;
        }
        if (charBefore && charBefore.match(/[a-z0-9,;:.]/)) {
            mod[index] = left(type);
            continue;
        }
        // fallthrough
        mod[index] = right(type);
    }
    var newLine = mod.join('');
    return newLine
        .replace(/([^`]|^)"`'([^` ])/g, '$1"`\'`$2')
        .replace(/([^` [])'`"/g, '$1`\'`"')
        .replace(/([^` [])"`'/g, '$1`"`\'')
        .replace(/(^|\b| |`|-)'`(\d\d)(\b|$| )/g, "$1`'$2$3")
        .replace(/([a-z])`"([a-z])/i, "$1`'$2")
        .replace(/(^|\b| |`|-)'`(')?(T|t)is(\b|$| )/g, function (_, a, b, c, d) {
        return "" + a + (b ? "'`" : '') + "`'" + c + "is" + d;
    });
}
exports.quotifyLine = quotifyLine;
function right(type) {
    return "" + type + BACKTICK;
}
function left(type) {
    return "" + BACKTICK + type;
}
var BACKTICK = '`';
