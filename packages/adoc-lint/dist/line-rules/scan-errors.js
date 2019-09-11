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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegexLintRunner_1 = __importDefault(require("../RegexLintRunner"));
var runner = new RegexLintRunner_1.default([
    {
        test: 'f',
        search: /( |^)(F|f) /g,
        replace: '$1I ',
    },
    {
        test: 'mmd',
        search: /\bmmd\b/g,
        replace: 'mind',
    },
    {
        test: 'lime|limes',
        search: /\blime(s)?\b/g,
        replace: 'time$1',
        allowIfNear: /(lemon|orange|kiln|fruit|manure|white|stone|juice|chloride)/i,
    },
    {
        test: 'wc',
        search: /\b(W|w)c\b/g,
        replace: '$1e',
    },
    {
        test: 'whoso',
        search: /\b(W|w)hoso\b/g,
        replace: '$1hose',
        message: '"whoso" is sometimes a scan error of "whose" except when it is a synonym for "whoever"',
        editions: ['original'],
        isMaybe: true,
    },
    {
        test: 'bo',
        search: /\b(B|b)o\b/g,
        replace: '$1e',
    },
    {
        test: 'T',
        search: /( |^)(T|t) /g,
        replace: '$1I ',
    },
    {
        test: 'ray',
        search: /\bray\b/g,
        replace: 'my',
        allowIfNear: /\b(ray of|gloom|sum)\b/i,
    },
    {
        test: 'arid',
        search: /\b(A|a)rid\b/g,
        replace: '$1nd',
        allowIfNear: /\b(dry|desert|parch)/i,
    },
    {
        test: 'arc',
        search: /\b(A|a)rc\b/g,
        replace: '$1re',
        allowIfNear: /\b(joan|jeanne)\b/i,
    },
    {
        test: 'fife',
        search: /\bfife\b/g,
        replace: 'life',
        allowIfNear: /\bfiddle\b|\bplay/i,
    },
    {
        test: 'Fie',
        search: /\bFie\b/g,
        replace: 'He',
    },
    {
        test: 'sec',
        search: /\b(S|s)ec(?!\.)\b/g,
        replace: '$1ee',
    },
    {
        test: 'aud',
        search: /\b(A|a)ud\b/g,
        replace: '$1nd',
    },
    {
        test: 'mc',
        search: /\bmc\b/g,
        replace: 'me',
    },
].map(function (d) { return (__assign(__assign({}, d), { test: "\\b" + d.test + "\\b" })); }), {
    fixable: false,
    message: '"<found>" is often a scanning error and should be corrected to "<fixed>"',
});
var rule = function (line, lines, lineNumber, lintOptions) {
    if (lintOptions.lang !== 'en') {
        return [];
    }
    return runner.getLineLintResults(line, lineNumber, lintOptions);
};
rule.slug = 'scan-errors';
runner.rule = rule.slug;
exports.default = rule;
