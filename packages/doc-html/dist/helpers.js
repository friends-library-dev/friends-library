"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var strip_indent_1 = __importDefault(require("strip-indent"));
exports.br7 = '<br class="m7"/>';
function ucfirst(lower) {
    return lower.replace(/^\w/, function (c) { return c.toUpperCase(); });
}
exports.ucfirst = ucfirst;
var smallEn = 'a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|via'.split('|');
var smallEs = 'a|un|una|el|la|los|las|y|e|o|con|de|del|al|por|si|en'.split('|');
function capitalizeTitle(str, lang) {
    var small = lang === 'en' ? smallEn : smallEs;
    return str
        .split(' ')
        .map(function (word, index, parts) {
        if (index === 0 || index === parts.length - 1) {
            return ucfirst(word);
        }
        return small.includes(word.toLowerCase()) ? word : ucfirst(word);
    })
        .join(' ');
}
exports.capitalizeTitle = capitalizeTitle;
function trimTrailingPunctuation(str) {
    return str.replace(/(?<!etc)[.,]$/, '');
}
exports.trimTrailingPunctuation = trimTrailingPunctuation;
function removeMobi7Tags(html) {
    return html
        .replace(/ *<br class="m7" *\/>\n?/gim, '')
        .replace(/ *<span class="m7">.+?<\/span>\n?/gim, '');
}
exports.removeMobi7Tags = removeMobi7Tags;
function wrapHtmlBody(bodyHtml, opts) {
    if (opts === void 0) { opts = {}; }
    return strip_indent_1.default("\n    <!DOCTYPE html>\n    <html>\n    <head>\n      " + (opts.title ? "<title>" + opts.title + "</title>" : '') + "\n      " + (opts.css || []).map(function (href) { return "<link href=\"" + href + "\" rel=\"stylesheet\" type=\"text/css\">"; }) + "\n    </head>\n    <body" + (opts.bodyClass ? " class=\"" + opts.bodyClass + "\"" : '') + ">\n      " + bodyHtml + "\n    </body>\n    </html>\n  ").trim();
}
exports.wrapHtmlBody = wrapHtmlBody;
