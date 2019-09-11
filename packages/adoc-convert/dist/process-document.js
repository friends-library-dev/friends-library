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
var headings_1 = require("./headings");
var epigraphs_1 = require("./epigraphs");
var adoc_to_html_1 = __importDefault(require("./adoc-to-html"));
var notes_1 = require("./notes");
function processDocument(adoc) {
    var shortHeadings = headings_1.extractShortHeadings(adoc);
    var _a = __read(epigraphs_1.extractEpigraphs(adoc), 2), epigraphs = _a[0], adocSansEpigraphs = _a[1];
    var _b = __read(adoc_to_html_1.default(adocSansEpigraphs), 2), completeHtml = _b[0], logs = _b[1];
    var _c = __read(notes_1.extractNotes(completeHtml), 2), notes = _c[0], htmlSansNotes = _c[1];
    return {
        notes: notes,
        epigraphs: epigraphs,
        sections: htmlToSections(htmlSansNotes, shortHeadings),
        logs: logs,
    };
}
exports.default = processDocument;
function htmlToSections(docHtml, shortHeadings) {
    return docHtml
        .split(/(?=<div class="sect1[^>]+?>)/gim)
        .filter(function (html) { return !!html.trim(); })
        .map(addSignedSectionClass)
        .map(function (html, i) { return ({ index: i, id: "section" + (i + 1), html: html }); })
        .map(function (section) { return headings_1.extractHeading(section, shortHeadings); });
}
function addSignedSectionClass(html) {
    var has = html.match(/class="(signed-section|salutation|letter-heading)/gm)
        ? 'has'
        : 'no';
    return html.replace(/^<div class="sect1/, "<div class=\"sect1 chapter--" + has + "-signed-section");
}
