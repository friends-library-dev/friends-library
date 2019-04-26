"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var asciidoc_1 = require("@friends-library/asciidoc");
var Cover_css_1 = __importDefault(require("./Cover.css"));
function cssVars(props) {
    var trim = asciidoc_1.getBookSize(props.printSize).dims;
    var coverPad = 0.25;
    var spinePad = 0.06;
    var pagesPerInch = 444;
    var spineWidth = spinePad + props.pages / pagesPerInch;
    return {
        coverHeight: trim.height + coverPad + "in",
        coverWidth: trim.width * 2 + spineWidth + coverPad + "in"
    };
}
exports.cssVars = cssVars;
function coverCss(props) {
    var css = Cover_css_1["default"];
    var vars = cssVars(props);
    Object.entries(vars).forEach(function (_a) {
        var key = _a[0], val = _a[1];
        var regx = new RegExp("var\\(--" + key + "\\)", 'g');
        css = css.replace(regx, val);
    });
    return css;
}
exports.coverCss = coverCss;
