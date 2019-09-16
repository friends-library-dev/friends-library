"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var lodash_1 = require("lodash");
var helpers_1 = require("./helpers");
exports.frontmatter = lodash_1.memoize(function (dpc) {
    var files = {
        'half-title': halfTitle(dpc),
        'original-title': originalTitle(dpc),
        copyright: copyright(dpc),
        epigraph: epigraph(dpc),
    };
    return lodash_1.pickBy(files, function (html) { return html !== ''; });
});
function epigraph(_a) {
    var epigraphs = _a.epigraphs;
    if (!epigraphs.length) {
        return '';
    }
    return "\n    <div class=\"epigraphs own-page\">\n      " + epigraphs.map(renderEpigraph).join("\n" + helpers_1.br7 + "\n" + helpers_1.br7 + "\n") + "\n    </div>\n  ";
}
exports.epigraph = epigraph;
function renderEpigraph(_a, index) {
    var text = _a.text, source = _a.source;
    return "\n    <div class=\"epigraph" + (index > 0 ? ' epigraph--not-first' : '') + "\">\n      <span class=\"epigraph__text\">\n        &#8220;" + text + "&#8221;\n      </span>\n      " + (source ? "<span class=\"epigraph__source\">" + source + "</span>" : '') + "\n    </div>\n  ";
}
function halfTitle(dpc) {
    var lang = dpc.lang, _a = dpc.meta, title = _a.title, editor = _a.editor, name = _a.author.name;
    var markup = "<h1>" + title + "</h1>";
    var nameInTitle = title.indexOf(name) !== -1;
    if (!nameInTitle) {
        markup = markup + "\n<p class=\"byline\">" + helpers_1.br7 + (lang === 'en' ? 'by' : 'por') + " " + name + "</p>";
    }
    if (editor && lang === 'en') {
        markup += "\n<p class=\"editor\">" + helpers_1.br7 + helpers_1.br7 + helpers_1.br7 + "Edited by " + editor + "</p>";
    }
    return markup;
}
exports.halfTitle = halfTitle;
function originalTitle(_a) {
    var meta = _a.meta, lang = _a.lang;
    if (!meta.originalTitle) {
        return '';
    }
    return "\n    <div class=\"original-title-page\">\n      <p class=\"originally-titled__label\">\n        Original title:\n        " + helpers_1.br7 + "\n        " + helpers_1.br7 + "\n      </p>\n      <p class=\"originally-titled__title\">\n        " + helpers_1.capitalizeTitle(meta.originalTitle, lang) + "\n      </p>\n    </div>\n  ";
}
function copyright(dpc) {
    var lang = dpc.lang, _a = dpc.revision, timestamp = _a.timestamp, sha = _a.sha, url = _a.url, _b = dpc.meta, published = _b.published, isbn = _b.isbn;
    var marginData = '';
    moment_1.default.locale(lang);
    var time = moment_1.default
        .utc(moment_1.default.unix(timestamp))
        .format(lang === 'en' ? 'MMMM Do, YYYY' : 'D [de] MMMM, YYYY');
    if (lang === 'es') {
        time = time
            .split(' ')
            .map(function (p) { return (p === 'de' ? p : helpers_1.ucfirst(p)); })
            .join(' ');
    }
    var strings = {
        publicDomain: 'Public domain in the USA',
        publishedIn: 'Originally published in',
        textRevision: 'Text revision',
        createdBy: 'Ebook created and freely distributed by',
        moreFreeBooks: 'Find more free books from early Quakers at',
        contact: 'Contact the publishers at',
    };
    if (lang === 'es') {
        strings = {
            publicDomain: 'Dominio público en los Estados Unidos de América',
            publishedIn: 'Publicado originalmente en',
            textRevision: 'Revisión de texto',
            createdBy: 'Creado y distribuido gratuitamente por',
            moreFreeBooks: 'Encuentre más libros gratis de los primeros Cuáqueros en',
            contact: 'Puede contactarnos en',
        };
    }
    return "\n  <div class=\"copyright-page\">\n    <ul>\n      " + marginData + "\n      <li>" + strings.publicDomain + "</li>\n      " + (published ? "<li>" + strings.publishedIn + " " + published + "</li>" : '') + "\n      " + (isbn ? "<li id=\"isbn\">ISBN: <code>" + isbn + "</code></li>" : '') + "\n      <li>" + strings.textRevision + " <code><a href=\"" + url + "\">" + sha + "</a></code> \u2014 " + time + "</li>\n      <li>" + strings.createdBy + " <a href=\"https://friendslibrary.com\">Friends Library Publishing</a></li>\n      <li>" + strings.moreFreeBooks + " <a href=\"https://friendslibrary.com\">friendslibrary.com</a></li>\n      <li>" + strings.contact + " <a href=\"mailto:info@friendslibrary.com.com\">info@friendslibrary.com</a></li>\n    </ul>\n  </div>\n  ";
}
exports.copyright = copyright;
