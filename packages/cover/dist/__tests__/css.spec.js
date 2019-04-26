"use strict";
exports.__esModule = true;
var asciidoc_1 = require("@friends-library/asciidoc");
var css_1 = require("../css");
describe('cssVars()', function () {
    var props;
    var trim;
    beforeEach(function () {
        props = {
            title: 'Journal of George Fox',
            author: 'George Fox',
            pages: 555,
            printSize: 'm'
        };
        (trim = asciidoc_1.getBookSize(props.printSize).dims);
    });
    test('cover height is book size height plus 0.25in fudge', function () {
        var coverHeight = css_1.cssVars(props).coverHeight;
        expect(coverHeight).toBe(trim.height + 0.25 + "in");
    });
    test('cover width is correct', function () {
        props.pages = 444; // 1 in
        var coverWidth = css_1.cssVars(props).coverWidth;
        expect(coverWidth).toBe(trim.width * 2 + 1 + 0.06 + 0.25 + "in");
    });
});
