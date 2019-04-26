"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var Cover = function (props) {
    var title = props.title, author = props.author;
    return (react_1["default"].createElement("div", { className: "cover" },
        react_1["default"].createElement("h1", null, title),
        react_1["default"].createElement("h2", null, author)));
};
exports["default"] = Cover;
