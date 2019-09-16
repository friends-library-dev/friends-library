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
var flow_1 = __importDefault(require("lodash/flow"));
var roman_numerals_1 = require("roman-numerals");
var headings_1 = require("../headings");
var helpers_1 = require("../helpers");
var frontmatter_1 = require("./frontmatter");
function paperbackInteriorHtml(dpc, volumeIdx, opts) {
    console.log('the main fn');
    return flow_1.default([joinSections, addFirstChapterClass, inlineNotes, prependFrontmatter])([
        '',
        dpc,
        opts,
    ])[0];
}
exports.default = paperbackInteriorHtml;
var joinSections = function (_a) {
    var _b = __read(_a, 3), html = _b[0], dpc = _b[1], opts = _b[2];
    console.log('join sections  s');
    var joined = dpc.sections
        .map(function (_a) {
        var html = _a.html, heading = _a.heading;
        return headings_1.replaceHeadings(html, heading, dpc).replace('<div class="sectionbody">', "<div class=\"sectionbody\" short=\"" + runningHeader(heading, dpc.lang) + "\">");
    })
        .join('\n');
    return [joined, dpc, opts];
};
function runningHeader(_a, lang) {
    var shortText = _a.shortText, text = _a.text, sequence = _a.sequence;
    if (shortText || text || !sequence) {
        return helpers_1.capitalizeTitle(helpers_1.trimTrailingPunctuation(shortText || text), lang).replace(/ \/ .+/, '');
    }
    return sequence.type + " " + roman_numerals_1.toRoman(sequence.number);
}
var addFirstChapterClass = function (_a) {
    var _b = __read(_a, 3), html = _b[0], dpc = _b[1], opts = _b[2];
    return [
        html.replace('<div class="sect1', '<div class="sect1 first-chapter'),
        dpc,
        opts,
    ];
};
var inlineNotes = function (_a) {
    var _b = __read(_a, 3), html = _b[0], dpc = _b[1], opts = _b[2];
    console.log('inline the notes');
    return [
        html.replace(/{% note: ([a-z0-9-]+) %}/gim, function (_, id) { return "<span class=\"footnote\">" + (dpc.notes.get(id) || '') + "</span>"; }),
        dpc,
        opts,
    ];
};
var prependFrontmatter = function (_a) {
    var _b = __read(_a, 3), html = _b[0], dpc = _b[1], opts = _b[2];
    console.log('INSIDE THE FRONTMATTER FUN');
    if (!opts.frontmatter) {
        console.log('do not add front matter');
        return [html, dpc, opts];
    }
    console.log('do add front matter');
    return [frontmatter_1.frontmatter(dpc).concat(html), dpc, opts];
};
