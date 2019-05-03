"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var asciidoc_1 = require("@friends-library/asciidoc");
var lodash_1 = require("lodash");
var cover_css_1 = __importDefault(require("./css/cover.css"));
function cssVars(props) {
    var book = asciidoc_1.getBookSize(props.printSize).dims;
    var safety = 0.25;
    var trimBleed = 0.125;
    var spinePad = 0.06;
    var pagesPerInch = 444;
    var spineWidth = spinePad + props.pages / pagesPerInch;
    return lodash_1.mapValues({
        trimBleed: trimBleed,
        safety: safety,
        pageWidth: book.width,
        pageHeight: book.height,
        spineWidth: spineWidth,
        halfSpineWidth: spineWidth / 2,
        spineDisplay: props.pages > 160 ? 'block' : 'none',
        edgeToSafe: trimBleed + safety,
        safeAreaWidth: book.width - safety * 2,
        safeAreaHeight: book.height - safety * 2,
        edgeToSpine: book.width + trimBleed,
        edgeToSpineCenter: book.width + trimBleed + spineWidth / 2,
        bookWidth: book.width,
        bookHeight: book.height,
        halfBookWidth: book.width / 2,
        halfBookHeight: book.height / 2,
        coverHeight: book.height + trimBleed * 2,
        coverWidth: book.width * 2 + spineWidth + trimBleed * 2,
        guideSafetyWidth: book.width * 2 + spineWidth,
        guidesDisplay: props.showGuides ? 'block' : 'none',
        threeDLeftOffset: (book.width - spineWidth) / 2,
        threeDTopOffset: (book.height - spineWidth) / 2,
        bgColor: {
            updated: 'rgb(133, 75, 94)',
            modernized: 'rgb(126, 155, 171)',
            original: 'rgb(173, 173, 148)',
            spanish: 'rgb(207, 166, 125)'
        }[props.edition]
    }, function (v) { return (typeof v === 'number' ? v + "in" : v); });
}
exports.cssVars = cssVars;
function coverCss(props, scaler) {
    var css = cover_css_1["default"];
    var vars = cssVars(props);
    Object.entries(vars).forEach(function (_a) {
        var key = _a[0], val = _a[1];
        var regx = new RegExp("var\\(--" + key + "\\)", 'g');
        css = css.replace(regx, val);
    });
    if (scaler) {
        css = css.replace(/(?<inches>\d*(?:\.\d+)?)in(?<after>;| |\))/g, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = args[args.length - 1], inches = _a.inches, after = _a.after;
            return Number(inches) * scaler + "in" + after;
        });
    }
    return css;
}
exports.coverCss = coverCss;
