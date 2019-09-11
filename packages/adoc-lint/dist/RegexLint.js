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
var RegexLint = /** @class */ (function () {
    function RegexLint(data) {
        this.defaults = {
            isMaybe: false,
            fixable: true,
            langs: ['en'],
            editions: ['original', 'modernized', 'updated'],
            message: '"<found>" <shouldBecome> "<fixed>" <inContext>',
            recommend: true,
        };
        this.data = __assign(__assign({}, this.defaults), data);
        this.search = this.data.search;
        this.isMaybe = this.data.isMaybe;
        this.test = this.data.test;
        this.langs = this.data.langs;
        this.editions = this.data.editions;
        this.allowIfNear = this.data.allowIfNear;
    }
    RegexLint.prototype.isFixable = function () {
        var fixable = this.data.fixable;
        return typeof fixable === 'function' ? fixable() : fixable;
    };
    RegexLint.prototype.message = function (found) {
        var fixed = this.execReplace(found);
        var shouldBecome = this.isMaybe
            ? 'is often (but not always!) better'
            : 'should be replaced with';
        var inContext = 'in all editions';
        if (this.data.editions.length < 3) {
            inContext = "in " + this.data.editions.join(' and ') + " editions";
        }
        return this.data.message
            .replace('<found>', found)
            .replace('<shouldBecome>', shouldBecome)
            .replace('<fixed>', fixed)
            .replace('<inContext>', inContext)
            .trim();
    };
    RegexLint.prototype.recommendation = function (match) {
        if (!this.data.recommend) {
            return;
        }
        var line = match.input || '';
        var index = match.index || 0;
        var parts = [
            line.substring(0, index),
            this.execReplace(line.substring(index, index + match[0].length)),
            line.substring(index + match[0].length),
        ];
        return parts.join('');
    };
    RegexLint.prototype.execReplace = function (str) {
        var replace = this.data.replace;
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/29789
        return str.replace(this.search, replace === undefined ? '???' : replace);
    };
    return RegexLint;
}());
exports.default = RegexLint;
