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
Object.defineProperty(exports, "__esModule", { value: true });
var roman_numerals_1 = require("roman-numerals");
function extractShortHeadings(adoc) {
    var headings = new Map();
    var regex = /\[#([a-z0-9-_]+)(?:\.[a-z0-9-_]+?)?,.*?short="(.*?)"\]\n== /gim;
    var match;
    while ((match = regex.exec(adoc))) {
        var _a = __read(match, 3), ref = _a[1], short = _a[2];
        headings.set(ref, entitiesToDecimal(short));
    }
    return headings;
}
exports.extractShortHeadings = extractShortHeadings;
function extractHeading(section, short) {
    var heading = { id: '', text: '' };
    var html = section.html.replace(/(<div class="sect1([^"]+?)?">\n)<h2 id="([^"]+)"[^>]*?>(.+?)<\/h2>/, function (_, start, kls, id, inner) {
        heading = __assign(__assign({ id: id }, parseHeading(inner)), (short.has(id) ? { shortText: short.get(id) } : {}));
        var match = kls.match(/ style-([a-z]+)/);
        var sectionStart = start.replace(/ style-[a-z]+/, '');
        return sectionStart + "{% chapter-heading" + (match ? ", " + match[1] : '') + " %}";
    });
    if (heading.id === '') {
        throw new Error("Unable to extract chapter-level heading from section: " + section.id);
    }
    return __assign(__assign({}, section), { html: html, heading: heading });
}
exports.extractHeading = extractHeading;
function parseHeading(text) {
    var pattern = /(chapter|section|capítulo) ((?:[1-9]+[0-9]*)|(?:[ivxlcdm]+))(?::|\.)?(?:\s+([^<]+))?/i;
    var match = text.match(pattern);
    if (!match) {
        return { text: entitiesToDecimal(text.trim()) };
    }
    var _a = __read(match, 4), type = _a[1], number = _a[2], body = _a[3];
    return {
        text: entitiesToDecimal((body || '').trim()),
        sequence: {
            type: type.replace(/^\w/, function (c) { return c.toUpperCase(); }),
            number: Number.isNaN(+number) ? roman_numerals_1.toArabic(number) : +number,
        },
    };
}
function entitiesToDecimal(text) {
    return text.replace(/ & /g, ' &#38; ');
}
