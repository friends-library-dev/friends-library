"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var asciidoc_1 = require("@friends-library/asciidoc");
var lodash_1 = require("lodash");
var Cover_css_1 = __importDefault(require("./Cover.css"));
function cssVars(props) {
    var trim = asciidoc_1.getBookSize(props.printSize).dims;
    var coverPad = 0.25;
    var spinePad = 0.06;
    var pagesPerInch = 444;
    var spineWidth = spinePad + props.pages / pagesPerInch;
    return lodash_1.mapValues({
        trim: 0.125,
        safety: 0.25,
        pageWidth: trim.width,
        pageHeight: trim.height,
        spineWidth: spineWidth,
        coverHeight: trim.height + coverPad,
        coverWidth: trim.width * 2 + spineWidth + coverPad
    }, function (v) { return v + "in"; });
}
exports.cssVars = cssVars;
function coverCss(props, context) {
    var css = Cover_css_1["default"];
    var vars = cssVars(props);
    Object.entries(vars).forEach(function (_a) {
        var key = _a[0], val = _a[1];
        var regx = new RegExp("var\\(--" + key + "\\)", 'g');
        css = css.replace(regx, val);
    });
    var PDF_TO_WEB_MULTIPLIER = 1.1358;
    if (context === 'web') {
        css = css.replace(/(?<inches>\d*(?:\.\d+)?)in(?<after>;| )/g, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = args[args.length - 1], inches = _a.inches, after = _a.after;
            return Number(inches) * PDF_TO_WEB_MULTIPLIER + "in" + after;
        });
    }
    return css;
}
exports.coverCss = coverCss;
