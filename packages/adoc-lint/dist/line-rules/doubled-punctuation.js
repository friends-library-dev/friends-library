"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var roman_numerals_1 = require("roman-numerals");
var rule = function (line, lines, lineNumber) {
    if (line === '') {
        return [];
    }
    var doubles = [
        "`'`'",
        "'`'`",
        '`"`"',
        '"`"`',
        ',,',
        ';;',
        '??',
        '.,',
        ',.',
        ':.',
        '.:',
        '.;',
        ';.',
        '!.',
        '.!',
    ];
    var lints = [];
    doubles.forEach(function (double) {
        if (!line.includes(double)) {
            return;
        }
        for (var i = 0; i < line.length; i++) {
            if (line.substring(i, i + double.length) === double &&
                !specialCase(double, line, i)) {
                lints.push(getLint(line, lineNumber, double, i));
            }
        }
    });
    return lints;
};
function specialCase(double, line, column) {
    if (!['.,', '.:', '.;', '.!'].includes(double)) {
        return false;
    }
    if (line[column - 1] && line[column - 1].match(/\d/)) {
        return true;
    }
    var two = line.substring(column - 2, column).toLowerCase();
    var allowedTwo = ['jr', 'sr', 'mo', 'ii', 'co', 'pa', 'pp'];
    if (two.length === 2 && allowedTwo.includes(two)) {
        return true;
    }
    // prettier-ignore
    var allowedThree = [
        'etc', 'viz', 'ult', 'jun', 'vol', '4to', 'i.e', 'esq', '1st',
        '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', 'p.m',
        'a.m', 'sen', 'pet', 'jan', 'feb', 'mar', 'apr', 'jul', 'aug',
        'sep', 'oct', 'nov', 'dec', 'm.d',
    ];
    var three = line.substring(column - 3, column).toLowerCase();
    if (three.length === 3 && allowedThree.includes(three)) {
        return true;
    }
    // prettier-ignore
    var allowedFour = [
        'vols', 'ibid', 'i. e', 'inst', 'mass', 'p. m', 'a. m',
        'matt', 'chap', 'faht',
    ];
    var four = line.substring(column - 4, column).toLowerCase();
    if (four.length === 4 && allowedFour.includes(four)) {
        return true;
    }
    // special case `G. F., and F. H. went to meeting`
    if (column >= 1 &&
        line[column] === '.' &&
        line[column - 1].match(/[A-Z]/) &&
        (column === 1 || line[column - 2] === ' ')) {
        return true;
    }
    if (three === "`'s" && four[0] && line[column - 4].match(/[A-Z]/)) {
        return true;
    }
    // catch roman numerals
    var lastWord = line
        .substring(0, column)
        .split(' ')
        .pop();
    try {
        var num = roman_numerals_1.toArabic(lastWord || '');
        if (typeof num === 'number') {
            return true;
        }
    }
    catch (e) {
        // ¯\_(ツ)_/¯
    }
    // shillings refs
    if (two.match(/^\ds$/)) {
        return true;
    }
    // definition lists
    if (double === '.:' && line[column + 1] === ':') {
        return true;
    }
    return false;
}
function getLint(line, lineNumber, double, colIndex) {
    var before = line.substring(0, colIndex);
    var after = line.substring(colIndex + double.length);
    var single = double.substring(0, double.length / 2);
    var recommendation = "" + before + single + after;
    var lint = {
        line: lineNumber,
        column: colIndex + 1 + double.length / 2,
        type: 'error',
        rule: rule.slug,
        message: 'Invalid doubled punctuation mark',
        recommendation: recommendation,
        fixable: double.length === 2,
    };
    if (double.length === 2 && double[0] !== double[1]) {
        delete lint.recommendation;
        delete lint.fixable;
    }
    return lint;
}
rule.slug = 'doubled-punctuation';
exports.default = rule;
