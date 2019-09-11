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
var RegexLint_1 = __importDefault(require("./RegexLint"));
var RegexLintRunner = /** @class */ (function () {
    function RegexLintRunner(lintData, options) {
        if (options === void 0) { options = {}; }
        this.lints = lintData.map(function (data) { return new RegexLint_1.default(__assign(__assign({}, options), data)); });
        this.testPattern = new RegExp(this.lints.map(function (l) { return l.test; }).join('|'), 'i');
    }
    RegexLintRunner.prototype.getLineLintResults = function (line, lineNumber, options) {
        var _this = this;
        var results = [];
        if (line === '' || !line.match(this.testPattern)) {
            return results;
        }
        this.lints.forEach(function (lint) {
            if (shouldLint(lint, options)) {
                var matches = _this.getLineMatches(lint, line);
                results = results.concat(matches.map(function (match) { return _this.getLintResult(match, lineNumber, lint); }));
            }
        });
        return results;
    };
    RegexLintRunner.prototype.getLineMatches = function (lint, line) {
        var matches = [];
        if (lint.allowIfNear && line.match(lint.allowIfNear)) {
            return matches;
        }
        if (lint.search.global) {
            var match = void 0;
            while ((match = lint.search.exec(line))) {
                matches.push(match);
            }
        }
        else {
            var match = lint.search.exec(line);
            if (match)
                matches.push(match);
        }
        return matches;
    };
    RegexLintRunner.prototype.getLintResult = function (match, lineNumber, lint) {
        if (!this.rule) {
            throw new Error('Must set RegexLintRunner.rule property');
        }
        var recommendation = lint.recommendation(match);
        return __assign({ line: lineNumber, column: getColumn(match, recommendation), fixable: lint.isFixable(), type: 'error', rule: this.rule, message: lint.message(match[0]) }, (recommendation ? { recommendation: recommendation } : {}));
    };
    return RegexLintRunner;
}());
exports.default = RegexLintRunner;
function getColumn(_a, corrected) {
    var _b = _a.index, index = _b === void 0 ? 0 : _b, _c = _a.input, before = _c === void 0 ? '' : _c;
    if (corrected === undefined) {
        return index + 1;
    }
    for (var i = 0; i < before.length; i++) {
        if (corrected[i] !== before[i]) {
            return i + 1;
        }
    }
    return before.length + 1;
}
function shouldLint(lint, _a) {
    var lang = _a.lang, edition = _a.editionType, maybe = _a.maybe;
    if (!lint.langs.includes(lang)) {
        return false;
    }
    if (edition && !lint.editions.includes(edition)) {
        return false;
    }
    if (lint.isMaybe && !maybe) {
        return false;
    }
    return true;
}
