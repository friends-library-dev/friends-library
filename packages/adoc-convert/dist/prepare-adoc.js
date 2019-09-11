"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var helpers_1 = require("./helpers");
exports.prepareAsciidoc = lodash_1.memoize(lodash_1.flow([
    replaceAsterisms,
    changeChapterSynopsisMarkup,
    changeChapterSubtitleBlurbMarkup,
    prepareDiscourseParts,
    discreteize,
    headingsInOpenBlocks,
    swapLineEndingDashesInVerse,
    emdashBeforeBookTitle,
    enAndEmDashToDoubleDash,
    entitiesToDecimal,
    escapeSemicolonAfterEntity,
    signaturePrependDoubleDash,
    doubleDashToEntity,
    collapseEmDashNewlineWhitespace,
    collapseFootnoteCarets,
    replaceSmallBreaks,
    helpBookTitleTouchingFootnote,
    restoreLineEndingDashesInVerse,
]));
function replaceSmallBreaks(adoc) {
    return adoc.replace(/\[\.small-break\]\n'''/gm, raw("<div class=\"small-break\">" + helpers_1.br7 + "</div>"));
}
function helpBookTitleTouchingFootnote(adoc) {
    return adoc.replace(/#footnote:\[/g, '#{blank}footnote:[');
}
function signaturePrependDoubleDash(adoc) {
    return adoc.replace(/(\[\.signed-section-signature\]\n)/gm, '$1--');
}
function collapseEmDashNewlineWhitespace(adoc) {
    return adoc.replace(/&#8212;\n([a-z]|&#8220;|&#8216;)/gim, '&#8212;$1');
}
function enAndEmDashToDoubleDash(adoc) {
    return adoc.replace(/[–|—]/g, '--');
}
function collapseFootnoteCarets(adoc) {
    return adoc.replace(/\^\nfootnote:\[/gim, 'footnote:[');
}
function doubleDashToEntity(adoc) {
    return adoc
        .replace(/\n--\n/gm, '{open-block-delimiter}')
        .replace(/(?<!class="[a-z- ]+)--/gm, '&#8212;')
        .replace(/{open-block-delimiter}/gm, '\n--\n');
}
function entitiesToDecimal(adoc) {
    return adoc
        .replace(/"`/gim, '&#8220;')
        .replace(/`"/gim, '&#8221;')
        .replace(/'`/gim, '&#8216;')
        .replace(/`'/gim, '&#8217;')
        .replace(/&hellip;/g, '&#8230;');
}
function escapeSemicolonAfterEntity(adoc) {
    return adoc.replace(/(?<entity>&#\d{2,4};);/, '$<entity>+++;+++');
}
function emdashBeforeBookTitle(adoc) {
    return adoc.replace(/--\[\.book-title\]#([\s|\S]+?)#/gm, '--+++<span class="book-title">+++$1+++</span>+++');
}
function swapLineEndingDashesInVerse(adoc) {
    return adoc.replace(/(?<=\n\[verse.*?\]\n____\n)([\s|\S]+?)(?=\n____)/gm, function (_, verseLines) { return verseLines.replace(/--\n/gm, '{verse-end-emdash}\n'); });
}
function restoreLineEndingDashesInVerse(adoc) {
    return adoc.replace(/{verse-end-emdash}/g, '&#8212;');
}
function prepareDiscourseParts(adoc) {
    return adoc.replace(/(?<=\[\.discourse-part\]\n)(Question:|Pregunta:|(?:Answer|Respuesta)(?: [0-9]+)?:|Objection:|Objeción:|Inquiry [0-9]+:)( |\n)/gim, '_$1_$2');
}
function replaceAsterisms(adoc) {
    return adoc.replace(/\[\.asterism\]\n'''/gim, raw("<div class=\"asterism\">" + helpers_1.br7 + "*&#160;&#160;*&#160;&#160;*" + helpers_1.br7 + helpers_1.br7 + "</div>"));
}
function changeChapterSynopsisMarkup(adoc) {
    return adoc.replace(/\[\.chapter-synopsis\]\n([\s\S]+?)(?=\n\n)/gim, function (_, inner) {
        var joined = inner
            .trim()
            .split('\n')
            .filter(function (line) { return !line.match(/^\/\//); })
            .map(function (line) { return line.trim(); })
            .map(function (line) { return line.replace(/^\* /, ''); })
            .join('&#8212;');
        return "[.chapter-synopsis]\n" + joined + "\n\n";
    });
}
function changeChapterSubtitleBlurbMarkup(adoc) {
    return adoc.replace(/\[\.chapter-subtitle--blurb\]\n([\s\S]+?)(?=\n\n)/gim, function (_, inner) {
        var joined = inner
            .trim()
            .split('\n')
            .join(' ');
        return raw("<h3 class=\"chapter-subtitle--blurb\">" + joined + "</h3>");
    });
}
function discreteize(adoc) {
    return adoc.replace(/\[((?:\.blurb|\.alt|\.centered)+)\]\n(====?) /gm, '[discrete$1]\n$2 ');
}
function headingsInOpenBlocks(adoc) {
    return adoc.replace(/(\n--\n\n)([\s\S]*?)(\n\n--\n)/gim, function (_, open, content, end) {
        var inner = content.replace(/(^|\n\n)(?:\[([^\]]+?)\]\n)?(===+ )/gim, function (__, start, bracket, heading) {
            var discrete = (bracket || '').indexOf('discrete') !== -1 ? '' : 'discrete';
            return start + "[" + discrete + (bracket || '') + "]\n" + heading;
        });
        return "" + open + inner + end;
    });
}
function raw(input) {
    return "++++\n" + input + "\n++++";
}
