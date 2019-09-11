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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var hilkiah = __importStar(require("@friends-library/hilkiah"));
var adoc_utils_1 = require("@friends-library/adoc-utils");
var split = adoc_utils_1.makeSplitLines(90, 45);
var rule = function (line, lines, lineNumber) {
    if (lengthOk(line)) {
        return [];
    }
    var recommendation = getRecommendation(line);
    return [
        __assign({ line: lineNumber, column: false, rule: rule.slug, type: 'error', message: 'Non-heading and non-list lines should not exceed 100 characters' }, (recommendation ? { recommendation: recommendation } : {})),
    ];
};
function lengthOk(line) {
    if (line.length < 100) {
        return true;
    }
    if (['//', '==', '* '].includes(line.substring(0, 2))) {
        return true;
    }
    if (line.match(/^\[.+\]$/)) {
        return true;
    }
    if (line.includes('[.book-title]#')) {
        return true;
    }
    return false;
}
function getRecommendation(line) {
    var refs = hilkiah.find(line);
    // pull out scripture refs for splitting
    var withoutRefs = refs.reduce(function (ln, ref, index) {
        return ln.replace(ref.match, "\u2022" + index);
    }, line);
    var block = split(withoutRefs);
    // now restore the scripture refs
    var reco = refs.reduce(function (adoc, ref, index) {
        return adoc.replace("\u2022" + index, ref.match);
    }, block);
    if (reco.trim() === line.trim() || reco.split('\n').length > 2) {
        return false;
    }
    return reco;
}
rule.slug = 'line-length';
exports.default = rule;
