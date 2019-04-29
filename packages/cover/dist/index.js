"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
function coverAsset(path) {
    var fullpath = __dirname + "/" + path;
    if (!fs_1["default"].existsSync(fullpath)) {
        throw new Error(fullpath + " does not exist!");
    }
    return fs_1["default"].readFileSync(fullpath, 'binary').toString();
}
exports.coverAsset = coverAsset;
var css_1 = require("./css");
exports.coverCss = css_1.coverCss;
var Cover_1 = require("./Cover");
exports.Cover = Cover_1["default"];
