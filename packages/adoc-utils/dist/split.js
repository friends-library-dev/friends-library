"use strict";
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hilkiah_1 = require("@friends-library/hilkiah");
var memoize_1 = __importDefault(require("lodash/memoize"));
function makeSplitLines(maxLen, minLen) {
    return function (input) {
        var sentences = splitIntoSentences(input);
        var validLines = sentences
            .map(function (sentence) {
            if (sentence.length <= maxLen || lineIsHeading(sentence)) {
                return sentence;
            }
            return splitSentence(sentence, maxLen, minLen);
        })
            .reduce(cleanup, [])
            .join('\n');
        return fixFootnoteSplitters(validLines);
    };
}
exports.makeSplitLines = makeSplitLines;
exports.splitLines = makeSplitLines(90, 45);
function splitIntoSentences(input) {
    var splitSentencesRegExp = regex.assemble([
        // last word before sentence-ending `.` or `,`
        /(?<lastWord>[A-Za-z)]{3}| [a-z)]{2}| 1[678][0-9]{2})/,
        // sentence-ending `.` or `,`
        /(?<punctuation>\.|\?)/,
        // optional close quote/apostrophe
        /(?<trailingQuote>`"|')?/,
        // followed by a required space
        ' ',
        // capture whatever the next character is for ruling out certain things
        /(?<nextCharacter>.)/,
    ], 'gm');
    return input
        .replace(/footnote:\[/gm, '^\nfootnote:[')
        .replace(/\] /gm, ']\n')
        .replace(splitSentencesRegExp, regex.groupsFirst(function (groups, match) {
        var lastWord = groups.lastWord, punctuation = groups.punctuation, _a = groups.trailingQuote, trailingQuote = _a === void 0 ? '' : _a, nextCharacter = groups.nextCharacter;
        if (lastWord === 'viz') {
            return match;
        }
        if (lastWord === 'ver' && punctuation === '.' && nextCharacter.match(/\d/)) {
            return match;
        }
        if (lastWord === 'etc' && nextCharacter.match(/[a-z]/)) {
            return match;
        }
        return "" + lastWord + punctuation + trailingQuote + NEWLINE + nextCharacter;
    }))
        .replace(/([A-Za-z]{2})!(`")? ([A-Z])/gm, "$1!$2" + NEWLINE + "$3")
        .split(NEWLINE)
        .join('\n')
        .split('\n');
}
function splitSentence(sentence, maxLen, minLen) {
    // first, split into phrases on all comma, semicolon, and colon
    var lines = splitByPunctuation(sentence);
    // next re-join short phrases to keep lines close ideal length
    lines = lines.reduce(rejoinShortPhrases(maxLen), ['']);
    // if we still have lines that are too long, split between words (without punctuation)
    lines = lines.reduce(splitBetweenWords(maxLen, minLen), []);
    // clean up and return as a single string including newlines
    return lines.reduce(cleanup, []).join('\n');
}
function splitByPunctuation(sentence) {
    return sentence.replace(/([,|;|:]) /gm, '$1\n').split('\n');
}
var rejoinShortPhrases = function (maxLen) {
    return function (acc, part) {
        var lastIndex = acc.length - 1;
        var lastLine = acc[lastIndex];
        if (lastLine === '') {
            acc[lastIndex] = part;
        }
        else if ((lastLine + " " + part).length < maxLen) {
            acc[lastIndex] = lastLine + " " + part;
        }
        else {
            acc.push(part);
        }
        return acc;
    };
};
function splitBetweenWords(maxLen, minLen) {
    return function (acc, part) {
        if (part.length < maxLen) {
            return acc.concat([part]);
        }
        var best = [''];
        var bestScore = 100000;
        var current;
        var currentScore;
        var splitLen = maxLen - 7;
        var words = part.split(' ');
        while (splitLen >= minLen) {
            current = getWordSplitCandidate(words, splitLen);
            currentScore = scoreSplitBetweenWords(current, minLen, maxLen);
            if (currentScore < bestScore) {
                best = current;
                bestScore = currentScore;
            }
            splitLen -= 7;
        }
        return acc.concat(best);
    };
}
function getWordSplitCandidate(words, splitLen) {
    var chunks = [[]];
    var lineIndex = 0;
    words.forEach(function (word) {
        if (chunks[lineIndex].join(' ').length < splitLen) {
            chunks[lineIndex].push(word);
            return;
        }
        lineIndex++;
        chunks[lineIndex] = [word];
    });
    return chunks.map(function (chunk) { return chunk.join(' '); });
}
function scoreSplitBetweenWords(arr, minLen, maxLen) {
    var score = 0;
    var prev;
    arr.forEach(function (part) {
        score += maxLen - part.length;
        if (part.length < minLen) {
            score += 20;
        }
        // prevent splitting on opening/closing parens
        if (part.match(/ \($/) || part.match(/^\)/)) {
            score += 200;
        }
        // prevent splitting before/after smart quote open
        if (part.match(/(--| )("|')`$/) || part.match(/^`("|')/)) {
            score += 200;
        }
        if (prev) {
            score += Math.abs(part.length - prev.length);
            // prevent splitting between double-dash
            if (part.match(/^-/) && prev.match(/-$/)) {
                score += 200;
            }
            // prevent splitting inside smart quote open
            if (prev.match(/("|')$/) && part.match(/^`/)) {
                score += 200;
            }
            // prevent splitting inside smart quote close
            if (prev.match(/`$/) && part.match(/^("|')/)) {
                score += 200;
            }
        }
        prev = part;
    });
    return score;
}
function cleanup(lines, line, index) {
    // this fixes lines like ^Oh,$
    if (lines[index - 1] && lines[index - 1].match(/^[A-Z][a-z]{1,3},$/)) {
        lines[index - 1] = lines[index - 1] + " " + line;
        return lines;
    }
    // this fixes lines that are just ^etc.$
    if (line === 'etc.' && index > 0) {
        lines[index - 1] = lines[index - 1] + " etc.";
        return lines;
    }
    if (getLeadingRef(line) && index) {
        var pos = getLeadingRef(line) || 0;
        var ref = line.substring(0, pos);
        var rest = line.substring(pos).trim();
        lines[index - 1] = lines[index - 1] + " " + ref;
        lines.push(rest);
        return lines;
    }
    lines.push(line);
    return lines;
}
var getLeadingRef = memoize_1.default(function (line) {
    if (line.match(/verse [0-9]+\./)) {
        return line.indexOf('.') + 1;
    }
    // catch refs in their "mutated" state
    if (line.match(/^((1|2) )?[A-Z][a-z]+({•})? [0-9]{1,2}{\^}[0-9,-]+\./)) {
        return line.indexOf('.') + 1;
    }
    var refs = hilkiah_1.find(line);
    if (refs.length === 0 || refs[0].position.start !== 0) {
        return null;
    }
    if (line[refs[0].position.end] === '.') {
        return line.indexOf('.') + 1;
    }
    return null;
});
function fixFootnoteSplitters(input) {
    return input
        .replace(/{(\n)?footnote(\n)?-(\n)?paragraph(\n)?-(\n)?split(\n)?}/gm, '\n{footnote-paragraph-split}\n')
        .replace(/\n+{footnote-paragraph-split}\n+/gm, '\n{footnote-paragraph-split}\n');
}
function refUnmutate(str) {
    return str.replace(/{•}/gm, '.').replace(/{\^}/gm, ':');
}
exports.refUnmutate = refUnmutate;
function refMutate(str) {
    return str.replace(/\./gm, '{•}').replace(/:/gm, '{^}');
}
exports.refMutate = refMutate;
function lineIsHeading(line) {
    return line[0] === '=';
}
var regex = {
    assemble: function (arr, flags) {
        return new RegExp(arr.map(function (p) { return (typeof p === 'string' ? p : p.source); }).join(''), flags);
    },
    groupsFirst: function (fn) {
        return function (substr) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var last = rest[rest.length - 1];
            var groups = typeof last === 'string' ? {} : last;
            return fn.apply(void 0, __spread([groups, substr], rest));
        };
    },
};
var NEWLINE = '__NEWLINE__';
