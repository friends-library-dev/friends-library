"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var roman_numerals_1 = require("roman-numerals");
function navText(_a) {
    var text = _a.text, shortText = _a.shortText, sequence = _a.sequence;
    var mainText = helpers_1.trimTrailingPunctuation(shortText || text).replace(/ \/ .+/, '');
    if (!sequence) {
        return mainText;
    }
    return sequence.type + " " + roman_numerals_1.toRoman(sequence.number) + (mainText ? " &#8212; " + mainText : '');
}
exports.navText = navText;
