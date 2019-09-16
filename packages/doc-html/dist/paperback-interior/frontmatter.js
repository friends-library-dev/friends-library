"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frontmatter_1 = require("../frontmatter");
var nav_1 = require("../nav");
function frontmatter(dpc) {
    return "\n    " + halfTitle(dpc) + "\n    " + originalTitle(dpc) + "\n    " + copyright(dpc) + "\n    " + frontmatter_1.epigraph(dpc) + "\n    " + toc(dpc) + "\n  ";
}
exports.frontmatter = frontmatter;
function toc(_a) {
    var lang = _a.lang, sections = _a.sections;
    if (sections.length === 1) {
        return '';
    }
    return "\n    <div class=\"toc own-page\">\n      <h1>" + (lang === 'en' ? 'Contents' : 'Índice') + "</h1>\n      " + sections.map(tocEntry).join('\n      ') + "\n    </div>\n  ";
}
function tocEntry(_a) {
    var heading = _a.heading;
    return ("\n    <p>\n      <a href=\"#" + (heading.id || '') + "\">\n        <span>" + nav_1.navText(heading) + "</span>\n      </a>\n    </p>\n    ").trim();
}
function copyright(dpc) {
    return frontmatter_1.copyright(dpc)
        .replace('copyright-page', 'copyright-page own-page')
        .replace('Ebook created', 'Created')
        .replace(/([^@])friendslibrary\.com/g, '$1www.friendslibrary.com');
}
function halfTitle(dpc) {
    return "\n    <div class=\"half-title-page own-page\">\n      <div>\n        " + frontmatter_1.halfTitle(dpc) + "\n      </div>\n    </div>\n  ";
}
function originalTitle(_a) {
    var meta = _a.meta;
    if (!meta.originalTitle) {
        return '';
    }
    return "\n    <div class=\"blank-page own-page\"></div>\n    <div class=\"original-title-page own-page\">\n      <p class=\"originally-titled__label\">\n        Original title:\n      </p>\n      <p class=\"originally-titled__title\">\n        " + meta.originalTitle + "\n      </p>\n    </div>\n  ";
}
