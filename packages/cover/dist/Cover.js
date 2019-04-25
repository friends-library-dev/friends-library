"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var Cover = function (_a) {
    var title = _a.title, author = _a.author;
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h1", null, title),
        react_1["default"].createElement("h2", null,
            author,
            " test 7")));
};
exports["default"] = Cover;
