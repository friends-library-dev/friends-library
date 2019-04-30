"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
// @ts-ignore
var friendData = window.Friends;
var Cover = function (props) {
    var title = props.title, author = props.author;
    var _a = initials(author), firstInitial = _a[0], lastInitial = _a[1];
    return (react_1["default"].createElement("div", { className: "cover" },
        react_1["default"].createElement("div", { className: "bg-block" }),
        react_1["default"].createElement("div", { className: "back" }),
        react_1["default"].createElement("div", { className: "spine" }),
        react_1["default"].createElement("div", { className: "front" },
            react_1["default"].createElement("img", { className: "logo", src: (process.env.PUBLIC_URL || '') + "/images/logo-icon.png", alt: "" }),
            react_1["default"].createElement("span", { className: "first-initial initial" }, firstInitial),
            react_1["default"].createElement("span", { className: "last-initial initial" }, lastInitial),
            react_1["default"].createElement("h1", { className: "title" }, title),
            react_1["default"].createElement("div", { className: "author" },
                react_1["default"].createElement("div", { className: "author-line" }),
                react_1["default"].createElement("h2", { className: "author-name" }, author)))));
};
exports["default"] = Cover;
function initials(author) {
    var _a = author.split(' '), first = _a[0], rest = _a.slice(1);
    return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}
