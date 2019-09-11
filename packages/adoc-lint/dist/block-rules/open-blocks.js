"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule = function (block) {
    var lines = block.split('\n');
    var delimiters = lines.reduce(function (delims, line, index) {
        if (line !== '--') {
            return delims;
        }
        var isStart = lines[index - 1].indexOf('[.') === 0;
        delims.push({
            line: index + 1,
            type: isStart ? 'start' : 'end',
            flagged: false,
        });
        return delims;
    }, []);
    var opened = false;
    var lints = delimiters.reduce(function (acc, current, index) {
        var prev = delimiters[index - 1];
        if (current.type === 'start') {
            if (opened && prev) {
                current.flagged = true;
                acc.push(unterminated(prev.line));
            }
            else if (lines[current.line] && lines[current.line] !== '') {
                acc.push(missingSurroundingSpace(current.line + 1));
            }
        }
        if (current.type === 'end') {
            if (!opened && (!prev || !prev.flagged)) {
                current.flagged = true;
                acc.push(unlabeled(current.line));
            }
            else if (lines[current.line - 2] !== '') {
                acc.push(missingSurroundingSpace(current.line));
            }
            else if (lines[current.line] && lines[current.line] !== '') {
                acc.push(missingSurroundingSpace(current.line + 1));
            }
        }
        opened = current.type === 'start';
        return acc;
    }, []);
    if (opened && delimiters.length > 0) {
        // @ts-ignore https://github.com/Microsoft/TypeScript/issues/30406
        lints.push(unterminated(delimiters.pop().line));
    }
    return lints;
};
function unterminated(line) {
    return {
        line: line,
        column: false,
        type: 'error',
        rule: rule.slug,
        message: 'This block was never terminated with a `--` line.',
    };
}
function unlabeled(line) {
    return {
        line: line,
        column: false,
        type: 'error',
        rule: rule.slug,
        message: 'Open blocks must be started with a class designation, like `[.embedded-content-document.letter]`',
    };
}
function missingSurroundingSpace(line) {
    return {
        line: line,
        column: false,
        type: 'error',
        fixable: true,
        rule: rule.slug,
        message: 'Open block delimiters should be surrounded by empty lines',
        recommendation: "--> add an empty line before line " + line,
    };
}
rule.slug = 'open-block';
exports.default = rule;
