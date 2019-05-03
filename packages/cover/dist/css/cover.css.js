"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var browser_or_node_1 = require("browser-or-node");
var guides_css_1 = __importDefault(require("./guides.css"));
var spine_css_1 = __importDefault(require("./spine.css"));
var initials_css_1 = __importDefault(require("./initials.css"));
var author_css_1 = __importDefault(require("./author.css"));
var diamond_css_1 = __importDefault(require("./diamond.css"));
var blurb_css_1 = __importDefault(require("./blurb.css"));
var _3d_css_1 = __importDefault(require("./3d.css"));
var css = "\n\n.web .cover,\n.pdf body {\n  font-family: 'Baskerville', Arial;\n  background: white;\n  color: white;\n}\n\n.web .cover-wrap {\n  position: relative;\n  margin: auto;\n}\n\n.web .cover,\n.web .cover-mask,\n.web .cover-wrap {\n  position: relative;\n  width: var(--coverWidth);\n  height: var(--coverHeight);\n}\n\n.web .cover-mask {\n  height: var(--pageHeight);\n  width: var(--guideSafetyWidth);\n  position: absolute;\n  top: 0;\n  left: 0 !important;\n  border: var(--trimBleed) solid rgba(255, 0, 0, 0.4);\n  border-color: #eaeaea;\n  xborder-color: yellow;\n  xbackground: rgba(255, 0, 0, 0.35);\n  z-index: 1;\n}\n\n.front,\n.back {\n  position: absolute;\n  top: var(--trimBleed);\n  xbackground: red;\n  width: var(--bookWidth);\n  height: var(--bookHeight);\n}\n\n.front {\n  right: var(--trimBleed);\n}\n\n.back {\n  left: var(--trimBleed);\n}\n\n.front__safe,\n.back__safe {\n  position: absolute;\n  top: var(--safety);\n  left: var(--safety);\n  width: var(--safeAreaWidth);\n  height: var(--safeAreaHeight);\n}\n\n.front__safe {\n  text-align: center;\n}\n\n.back__safe {\n\n}\n\n.front__safe .logo-icon {\n  height: 6.5%;\n  fill: var(--bgColor);\n  position: absolute;\n  top: 2.75%;\n  right: 0.2in;\n}\n\n.bg-block {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: var(--coverWidth);\n  height: 82%;\n  background: var(--bgColor);\n}\n\n@page {\n  size: var(--coverWidth) var(--coverHeight) landscape;\n  margin: 0;\n}\n\n.title {\n  margin-top: 64%;\n  line-height: 200%;\n  font-size: 0.35in;\n  font-weight: 400;\n  margin-left: 12%;\n  margin-right: 12%;\n  letter-spacing: 0.025in;\n}\n\n.isbn {\n  width: 1.25in;\n  background: white;\n  padding: 0.075in;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n}\n\n" + blurb_css_1["default"] + "\n" + diamond_css_1["default"] + "\n" + author_css_1["default"] + "\n" + initials_css_1["default"] + "\n" + spine_css_1["default"] + "\n" + guides_css_1["default"] + "\n" + (browser_or_node_1.isBrowser ? _3d_css_1["default"] : '') + "\n";
exports["default"] = css;
