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
function extractEpigraphs(adoc) {
    var epigraphs = [];
    var shortened = adoc.replace(/\[quote\.epigraph(?:, *, *([^\]]+?))?\]\n____+\n([\s\S]+?)\n____+/gim, function (_, source, text) {
        epigraphs.push(__assign({ text: text }, (source ? { source: source } : {})));
        return '';
    });
    return [epigraphs, shortened.trimLeft()];
}
exports.extractEpigraphs = extractEpigraphs;
