"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var Cover = function (props) {
    var title = props.title, author = props.author;
    return (react_1["default"].createElement("div", { className: "cover" },
        react_1["default"].createElement("div", { className: "bg-block" }),
        react_1["default"].createElement("div", { className: "back" }),
        react_1["default"].createElement("div", { className: "spine" }),
        react_1["default"].createElement("div", { className: "front" },
            react_1["default"].createElement("img", { className: "logo", src: (process.env.PUBLIC_URL || '') + "/images/logo-icon.png", alt: "" }),
            react_1["default"].createElement("h1", { className: "title" }, title),
            react_1["default"].createElement("h2", { className: "author" }, author))));
};
exports["default"] = Cover;
