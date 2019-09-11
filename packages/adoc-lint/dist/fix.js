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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lint_1 = __importDefault(require("./lint"));
var fix_single_pass_1 = __importDefault(require("./fix-single-pass"));
function fix(adoc, options) {
    var _a;
    if (options === void 0) { options = { lang: 'en' }; }
    var lints = lint_1.default(adoc, options);
    var fixable = lints.filter(function (l) { return l.fixable === true; });
    var unfixable = lints.filter(function (l) { return l.fixable !== true; });
    if (fixable.length === 0) {
        return { fixed: adoc, numFixed: 0, unfixable: unfixable };
    }
    var fixed = adoc;
    var remainingUnfixed = fixable.length;
    var remainingLints = lints;
    while (remainingUnfixed > 0) {
        _a = __read(fix_single_pass_1.default(fixed, remainingLints), 2), fixed = _a[0], remainingUnfixed = _a[1];
        if (remainingUnfixed > 0) {
            remainingLints = lint_1.default(fixed, options);
        }
    }
    return {
        fixed: fixed,
        unfixable: unfixable,
        numFixed: fixable.length,
    };
}
exports.default = fix;
