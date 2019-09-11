"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegexLintRunner_1 = __importDefault(require("../RegexLintRunner"));
var runner = new RegexLintRunner_1.default([
    {
        test: 'naylor',
        search: /\bNaylor\b/g,
        replace: 'Nayler',
        fixable: true,
        message: 'James Nayler\'s last name should always be spelled "Nayler"',
    },
    {
        test: 'pennington',
        search: /\bPennington\b/g,
        replace: 'Penington',
        fixable: true,
        message: 'Isaac Penington\'s last name should always be spelled "Penington"',
        allowIfNear: /\bSr\.|\bAlderman\b|\bFather\b|\bDaniel\b/,
    },
], { langs: ['en', 'es'] });
var rule = function (line, lines, lineNumber, lintOptions) {
    return runner.getLineLintResults(line, lineNumber, lintOptions);
};
rule.slug = 'consistent-name-spelling';
runner.rule = rule.slug;
exports.default = rule;
