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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var git_conflict_markers_1 = __importDefault(require("./git-conflict-markers"));
var character_name_1 = __importDefault(require("../character-name"));
var rule = function (line, lines, lineNumber, options) {
    if (line === '') {
        return [];
    }
    if (git_conflict_markers_1.default(line, lines, lineNumber, options).length) {
        return [];
    }
    var escapeStart;
    var escapeEnd;
    var hasEscape = line.includes('+++');
    if (hasEscape) {
        escapeStart = line.indexOf('+++') + 3;
        escapeEnd = escapeStart + line.substring(escapeStart).indexOf('+++');
    }
    var allowed = maps[options.lang];
    var results = [];
    line.split('').forEach(function (char, index) {
        if (hasEscape && (escapeStart <= index && escapeEnd > index)) {
            return;
        }
        if (!allowed[char]) {
            var name_1 = character_name_1.default(char);
            results.push(getLint(char, line, lineNumber, index + 1, name_1));
        }
    });
    return results;
};
function getLint(char, line, lineNumber, column, name) {
    var hex = (char.codePointAt(0) || 0).toString(16);
    var unicode = "\\u" + '0000'.substring(0, 4 - hex.length) + hex;
    var fixableReco = fixable(name, line, column);
    return __assign({ line: lineNumber, column: column, type: 'error', rule: rule.slug, message: "Dissallowed character: `" + char + "`, code: `" + unicode + "` (" + name + ")" }, (fixableReco !== false ? { fixable: true, recommendation: fixableReco } : {}));
}
function fixable(name, line, column) {
    switch (name) {
        case 'EN DASH':
            return line.replace(/–/g, '-');
        case 'NO-BREAK SPACE':
            return nbsp(line, column);
        case 'CYRILLIC CAPITAL LETTER O':
            return line.replace(/О/g, 'O');
        case 'BULLET':
        case 'SOFT HYPHEN':
            return "" + line.substring(0, column - 1) + line.substring(column);
        case 'RIGHT SINGLE QUOTATION MARK':
            return line.replace(/’/g, "`'");
        case 'LEFT SINGLE QUOTATION MARK':
            return line.replace(/‘/g, "'`");
        case 'RIGHT DOUBLE QUOTATION MARK':
            return line.replace(/”/g, '`"');
        case 'LEFT DOUBLE QUOTATION MARK':
            return line.replace(/“/g, '"`');
        default:
            return false;
    }
}
function nbsp(line, column) {
    if (column === 1) {
        return line.replace(/^ +/, ''); // eslint-disable-line no-irregular-whitespace
    }
    if (line.substring(column - 11, column - 1) === 'footnote:[') {
        return line.replace(/footnote:\[./, 'footnote:[');
    }
    if (line[column] === ' ' || line[column - 2] === ' ') {
        return "" + line.substring(0, column - 1) + line.substring(column);
    }
    return line.substring(0, column - 1) + " " + line.substring(column);
}
// performance sort of matters here, because we're checking every character
// of sometimes every book -- using object property lookup was about 25%
// faster than using Set.has(x), in my testing, and WAY faster than [].includes(x)
var allowedEn = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '01234567890',
    '.,;:!?',
    '"\'`',
    '£$',
    '[]#%^&*()-_=+\\/{}°',
    '\n ',
];
var allowedEs = allowedEn.concat(['íéóáúñü', 'ÍÉÓÁÚÑÜ', '¡¿']);
var maps = {
    es: toObject(allowedEs),
    en: toObject(allowedEn),
};
rule.slug = 'invalid-characters';
exports.default = rule;
function toObject(arr) {
    var lookup = {};
    return arr
        .join('')
        .split('')
        .reduce(function (obj, char) {
        obj[char] = true;
        return obj;
    }, lookup);
}
