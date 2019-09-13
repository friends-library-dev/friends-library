"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var roman_numerals_1 = require("roman-numerals");
function replaceHeadings(html, heading, dpc) {
    var docStyle = dpc.config.chapterHeadingStyle || 'normal';
    return html.replace(/{% chapter-heading(?:, ([a-z]+))? %}/, function (_, style) {
        return headingMarkup(heading, style || docStyle);
    });
}
exports.replaceHeadings = replaceHeadings;
function headingMarkup(_a, style) {
    var id = _a.id, sequence = _a.sequence, text = _a.text;
    var textMarkup = headingTextMarkup(text);
    if (!sequence || (sequence && !text)) {
        return "\n      <div class=\"chapter-heading chapter-heading--" + style + "\" id=\"" + id + "\">\n        <h2>" + (!sequence ? textMarkup : sequence.type + " " + roman_numerals_1.toRoman(sequence.number)) + "</h2>\n        <br class=\"m7\"/>\n      </div>\n    ";
    }
    return "\n    <div class=\"chapter-heading chapter-heading--" + style + "\" id=\"" + id + "\">\n      <h2 class=\"chapter-heading__sequence\">\n        " + sequence.type + "&#160;\n        <span class=\"chapter-heading__sequence__number\">\n          " + roman_numerals_1.toRoman(sequence.number) + "\n        </span>\n      </h2>\n      <br class=\"m7\"/>\n      <div class=\"chapter-heading__title\">\n        " + textMarkup + "\n      </div>\n      <br class=\"m7\"/>\n    </div>\n  ";
}
function headingTextMarkup(text) {
    if (text.indexOf(' / ') === -1) {
        return text;
    }
    return text
        .split(' / ')
        .map(function (part, index, parts) {
        if (index === 0) {
            return "<span class=\"line line-1\">" + part + " <br class=\"m7\"/></span>";
        }
        if (index === parts.length - 1) {
            return "<span class=\"line line-" + (index + 1) + "\">" + part + "</span>";
        }
        return "<span class=\"line line-" + (index + 1) + "\">" + part + "</span>";
    })
        .join('');
}
