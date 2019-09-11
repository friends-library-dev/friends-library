"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (line, lines, lineNumber) {
    if (line[0] !== '=') {
        return [];
    }
    if (line.match(/^={2,4} [^\s\n]/)) {
        return [];
    }
    if (line === '=======') {
        return []; // will be flagged by `git-conflict-markers`
    }
    var fixable = !!line.match(/^={2,4}  +/);
    return [
        __assign({ line: lineNumber, column: 1, type: 'error', rule: rule.slug, message: 'Headings may only have 2-4 equal signs, and must be followed by a space and at least one character', fixable: fixable }, (fixable ? { recommendation: line.replace(/  +/, ' ') } : {})),
    ];
};
rule.slug = 'invalid-heading';
exports.default = rule;
