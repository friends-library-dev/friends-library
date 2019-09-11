"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __importDefault(require("uuid"));
var striptags_1 = __importDefault(require("striptags"));
var helpers_1 = require("./helpers");
function extractNotes(srcHtml) {
    var map = new Map();
    var html = srcHtml.replace(/<sup class="footnote">\[<a id="_footnoteref_([0-9]+)"[\s\S]+?<\/sup>/gim, function (_, num) {
        var id = uuid_1.default();
        map.set(num, id);
        return "{% note: " + id + " %}";
    });
    var notes = new Map();
    html = html.replace(/<div class="footnote" id="_footnotedef_([0-9]+)[\S\s]+?<\/div>/gim, function (full, num) {
        var note = striptags_1.default(full, ['em', 'i', 'strong', 'b', 'span'])
            .trim()
            .replace(/{footnote-paragraph-split}/g, "<span class=\"fn-split\">" + helpers_1.br7 + helpers_1.br7 + "</span>")
            .replace(/^[0-9]+\. /, '');
        notes.set(map.get(num) || '', expandFootnotePoetry(note));
        return '';
    });
    html = html.replace(/<div id="footnotes"[\s\S]+?<\/div>/gim, '');
    return [notes, html];
}
exports.extractNotes = extractNotes;
function expandFootnotePoetry(html) {
    var nowrap = helpers_1.makeReduceWrapper('', '');
    return html.replace(/ ` {4}(.+?) *?`( )?/gim, function (_, poem) {
        var stanzas = false;
        return poem
            .split('      ')
            .map(function (line) {
            if (line.match(/^- - -/)) {
                stanzas = true;
                return '</span>\n<span class="verse__stanza">';
            }
            var spacer = '&#160;&#160;&#160;&#160;';
            line = line.replace(/^ +/, function (leadingWhitespace) {
                return leadingWhitespace
                    .split('')
                    .map(function () { return spacer; })
                    .join('');
            });
            return "<span class=\"verse__line\">" + helpers_1.br7 + line + "</span>";
        })
            .reduce(stanzas ? helpers_1.makeReduceWrapper('<span class="verse__stanza">', '</span>') : nowrap, [])
            .reduce(helpers_1.makeReduceWrapper("<span class=\"verse\">" + helpers_1.br7, '</span>'), [])
            .join('\n');
    });
}
