"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doc_html_1 = require("@friends-library/doc-html");
var lodash_1 = require("lodash");
var helpers_1 = require("./helpers");
exports.postProcessHtml = lodash_1.memoize(lodash_1.flow([
    changeVerseMarkup,
    modifyOldStyleHeadings,
    function (html) { return html.replace(/<hr>/gim, '<hr />'); },
    function (html) { return html.replace(/<br>/gim, '<br />'); },
    function (html) { return html.replace(/<blockquote>/gim, "<blockquote>" + doc_html_1.br7); },
    removeParagraphClass,
    function (html) {
        return html.replace(/(?<=<div class="offset">\n)([\s\S]*?)(?=<\/div>)/gim, doc_html_1.br7 + "$1" + doc_html_1.br7);
    },
    function (html) {
        return html.replace(/<div class="discourse-part">/gm, "<div class=\"discourse-part\">" + doc_html_1.br7);
    },
]));
function modifyOldStyleHeadings(html) {
    return html.replace(/<div class="sect2 old-style( [^"]+?)?">\n<h3 ([^>]+?)>([\s\S]+?)<\/h3>/gim, function (_, kls, h3id, text) {
        var inner = text
            .split(' / ')
            .map(function (part, index, parts) {
            if (index === 0) {
                return "<span>" + part + " <br class=\"m7\"/></span>";
            }
            if (index === parts.length - 1) {
                return "<span><em>" + part + "</em></span>";
            }
            return "<span><em>" + part + "</em> <br class=\"m7\"/></span>";
        })
            .join('');
        return "<div class=\"sect2\"><h3 " + h3id + " class=\"old-style" + (kls || '') + "\">" + inner + "</h3>";
    });
}
function removeParagraphClass(html) {
    var standalone = [
        'salutation',
        'discourse-part',
        'offset',
        'numbered',
        'the-end',
        'postscript',
        'chapter-synopsis',
        'letter-participants',
        'signed-section-signature',
        'signed-section-closing',
        'signed-section-context-open',
        'signed-section-context-close',
    ];
    return html.replace(/<div class="paragraph ([a-z0-9- ]+?)">/g, function (full, extra) {
        var classes = extra.split(' ');
        if (lodash_1.intersection(standalone, classes).length) {
            return "<div class=\"" + extra + "\">";
        }
        return full;
    });
}
function changeVerseMarkup(html) {
    return html.replace(/<div class="verseblock">\n<pre class="content">([\s\S]*?)<\/pre>\n<\/div>/gim, function (_, verses) {
        var hasStanzas = verses.match(/\n\n/gm);
        var stanzaOpen = hasStanzas ? '\n<div class="verse__stanza">' : '';
        var stanzaClose = hasStanzas ? '</div>\n' : '';
        return verses
            .trim()
            .split('\n')
            .map(function (verse) {
            return verse
                ? "<div class=\"verse__line\">" + verse + "</div>"
                : "" + stanzaClose + stanzaOpen;
        })
            .reduce(helpers_1.makeReduceWrapper("<div class=\"verse\">" + stanzaOpen, stanzaClose + "</div>"), [])
            .join('\n');
    });
}
