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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var doc_css_1 = require("@friends-library/doc-css");
var flow_1 = __importDefault(require("lodash/flow"));
var lulu_1 = require("@friends-library/lulu");
var doc_html_1 = require("@friends-library/doc-html");
var wrap_html_1 = __importDefault(require("../wrap-html"));
var frontmatter_1 = __importDefault(require("./frontmatter"));
var pdf_shared_1 = require("../pdf-shared");
function paperbackInteriorManifests(dpc, conf) {
    return __awaiter(this, void 0, void 0, function () {
        var docCss;
        return __generator(this, function (_a) {
            docCss = doc_css_1.paperbackInterior(dpc, conf);
            if (conf.allowSplits === false || dpc.paperbackSplits.length === 0) {
                return [2 /*return*/, [
                        {
                            'doc.html': html(dpc, conf),
                            'doc.css': docCss,
                            'line.svg': pdf_shared_1.lineSvgMarkup(),
                        },
                    ]];
            }
            return [2 /*return*/, __spread(dpc.paperbackSplits, [Infinity]).map(function (split, volIdx) {
                    return {
                        'doc.html': html(dpc, conf, volIdx),
                        'doc.css': docCss,
                        'line.svg': pdf_shared_1.lineSvgMarkup(),
                    };
                })];
        });
    });
}
exports.default = paperbackInteriorManifests;
function html(dpc, conf, volIdx) {
    return flow_1.default([
        pdf_shared_1.joinSections,
        addFirstChapterClass,
        pdf_shared_1.inlineNotes,
        prependFrontmatter,
        function (_a) {
            var _b = __read(_a, 4), html = _b[0], d = _b[1], c = _b[2], i = _b[3];
            return [doc_html_1.removeMobi7Tags(html), d, c, i];
        },
        wrapHtml,
    ])(['', dpc, conf, volIdx])[0];
}
var addFirstChapterClass = function (_a) {
    var _b = __read(_a, 4), html = _b[0], dpc = _b[1], conf = _b[2], volIdx = _b[3];
    return [
        html.replace('<div class="sect1', '<div class="sect1 first-chapter'),
        dpc,
        conf,
        volIdx,
    ];
};
var prependFrontmatter = function (_a) {
    var _b = __read(_a, 4), html = _b[0], dpc = _b[1], conf = _b[2], volIdx = _b[3];
    if (!conf.frontmatter) {
        return [html, dpc, conf, volIdx];
    }
    var splitDpc = __assign(__assign({}, dpc), { sections: dpc.sections.filter(pdf_shared_1.makeVolumeSplitFilter(dpc, volIdx)) });
    return [frontmatter_1.default(splitDpc, volIdx).concat(html), dpc, conf, volIdx];
};
var wrapHtml = function (_a) {
    var _b = __read(_a, 4), html = _b[0], dpc = _b[1], conf = _b[2], volIdx = _b[3];
    var abbrev = lulu_1.getPrintSizeDetails(conf.printSize || 'm').abbrev;
    var wrapped = wrap_html_1.default(html, {
        title: dpc.meta.title,
        css: ['doc.css'],
        bodyClass: "body trim--" + abbrev,
    });
    return [wrapped, dpc, conf, volIdx];
};
