"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAsciidocBracketLine(line) {
    return line[0] === '[' && line[line.length - 1] === ']';
}
exports.isAsciidocBracketLine = isAsciidocBracketLine;
function isFootnotePoetryLine(line, lines, number) {
    if (line.match(/^` {4}/)) {
        return true;
    }
    if (!line.match(/^(\s){5}/)) {
        return false;
    }
    if (!lines[number - 2]) {
        return false;
    }
    var index = number - 2;
    var prevLine = lines[index];
    while (prevLine) {
        // this special line starts footnote poetry
        if (prevLine.match(/^`(\s){4}/)) {
            return true;
        }
        // means we've moved up INTO a footnote, so were not in one before
        if (prevLine.match(/\]$/)) {
            return false;
        }
        // we're exiting a footnote, and didn't fine the special starter line
        if (prevLine.match(/footnote:\[/)) {
            return false;
        }
        index -= 1;
        prevLine = lines[index];
    }
    return false;
}
exports.isFootnotePoetryLine = isFootnotePoetryLine;
