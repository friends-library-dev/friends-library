"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeReduceWrapper(before, after) {
    return function (acc, str, index, array) {
        if (acc === void 0) { acc = []; }
        index === 0 && acc.unshift(before);
        acc.push(str);
        index === array.length - 1 && acc.push(after);
        return acc;
    };
}
exports.makeReduceWrapper = makeReduceWrapper;
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
