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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var mapValues_1 = __importDefault(require("lodash/mapValues"));
var lulu_1 = require("@friends-library/lulu");
function paperbackInterior(dpc, conf) {
    var css = __spread([
        'common',
        'pdf/base',
        'pdf/typography',
        'pdf/half-title',
        'pdf/original-title',
        'pdf/copyright',
        'pdf/toc',
        'pdf/chapter-heading',
        'pdf/paperback-interior'
    ], (dpc.notes.size < 5 ? ['pdf/symbol-notes'] : []), (conf.condense ? ['pdf/condense'] : [])).map(function (file) { return __dirname + "/../src/css/" + file + ".css"; })
        .map(function (file) { return fs_1.default.readFileSync(file).toString(); })
        .join('\n');
    return replaceVars(css, dpc, conf);
}
exports.paperbackInterior = paperbackInterior;
function replaceVars(css, dpc, conf) {
    var sections = dpc.sections, meta = dpc.meta, config = dpc.config;
    var size = lulu_1.getPrintSizeDetails(config.printSize);
    var runningHead = sections.length === 1 ? meta.author.name : config.shortTitle || meta.title;
    var vars = __assign(__assign({ '--running-head-title': "\"" + runningHead + "\"", '--chapter-margin-top': size.dims.height / 4 + "in" }, printDims(size)), condenseVars(size.dims.height));
    return css.replace(/var\((--[^\)]+)\)/g, function (_, varId) {
        return vars[varId];
    });
}
function condenseVars(pageHeight) {
    var topMargin = 0.7;
    var btmMargin = 0.55;
    return {
        '--condensed-copyright-page-height': pageHeight - topMargin - btmMargin + "in",
        '--condensed-half-title-page-height': pageHeight - (topMargin + btmMargin) * 3 + "in",
        '--condensed-page-top-margin': topMargin + "in",
        '--condensed-page-bottom-margin': btmMargin + "in",
    };
}
function printDims(size) {
    return mapValues_1.default({
        '--page-width': size.dims.width,
        '--page-height': size.dims.height,
        '--page-top-margin': size.margins.top,
        '--page-bottom-margin': size.margins.bottom,
        '--page-outer-margin': size.margins.outer,
        '--page-inner-margin': size.margins.inner,
        '--running-head-margin-top': size.margins.runningHeadTop,
    }, function (v) { return v + "in"; });
}
exports.printDims = printDims;
