"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var LogoIcon_1 = __importDefault(require("./LogoIcon"));
var publicUrl = process.env.PUBLIC_URL || '';
var Cover = function (props) {
    var title = props.title, author = props.author, isbn = props.isbn, edition = props.edition, blurb = props.blurb;
    var _a = initials(author), firstInitial = _a[0], lastInitial = _a[1];
    return (react_1["default"].createElement("div", { className: "cover" },
        react_1["default"].createElement("div", { className: "bg-block" }),
        react_1["default"].createElement("div", { className: "back" },
            react_1["default"].createElement("div", { className: "blurb" }, blurb),
            isbn && (react_1["default"].createElement("img", { className: "isbn", src: publicUrl + "/images/isbn/" + isbn + ".png", alt: "" }))),
        react_1["default"].createElement("div", { className: "spine" },
            react_1["default"].createElement("div", { className: "spine__title" }, title),
            react_1["default"].createElement(LogoIcon_1["default"], null)),
        react_1["default"].createElement("div", { className: "front" },
            react_1["default"].createElement("div", { className: "diamond" },
                react_1["default"].createElement("div", { className: "diamond__shape" }),
                react_1["default"].createElement("div", { className: "diamond__initial" }, edition[0].toUpperCase())),
            react_1["default"].createElement(LogoIcon_1["default"], null),
            react_1["default"].createElement("span", { className: "first-initial initial" }, firstInitial),
            react_1["default"].createElement("span", { className: "last-initial initial" }, lastInitial),
            react_1["default"].createElement("h1", { className: "title" }, title),
            react_1["default"].createElement("div", { className: "author" },
                react_1["default"].createElement("div", { className: "author__line" }),
                react_1["default"].createElement("h2", { className: "author__name" }, author))),
        react_1["default"].createElement("div", { className: "guide guide--box guide--trim-bleed" }),
        react_1["default"].createElement("div", { className: "guide guide--box guide--safety guide--safety-front" }),
        react_1["default"].createElement("div", { className: "guide guide--box guide--safety guide--safety-back" }),
        react_1["default"].createElement("div", { className: "guide guide--spine guide--vertical guide--spine-left" }),
        react_1["default"].createElement("div", { className: "guide guide--spine guide--vertical guide--spine-center" }),
        react_1["default"].createElement("div", { className: "guide guide--spine guide--vertical guide--spine-right" })));
};
exports["default"] = Cover;
function initials(author) {
    var _a = author.split(' '), first = _a[0], rest = _a.slice(1);
    return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}
