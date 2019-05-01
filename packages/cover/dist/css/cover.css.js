"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var guides_css_1 = __importDefault(require("./guides.css"));
var spine_css_1 = __importDefault(require("./spine.css"));
var initials_css_1 = __importDefault(require("./initials.css"));
var author_css_1 = __importDefault(require("./author.css"));
var diamond_css_1 = __importDefault(require("./diamond.css"));
var blurb_css_1 = __importDefault(require("./blurb.css"));
var css = "\n\n.web .cover,\n.pdf body {\n  font-family: 'Baskerville', Arial;\n  background: white;\n  color: white;\n}\n\n.web .cover-wrap {\n  position: relative;\n  margin: 0 auto;\n}\n\n.web .cover,\n.web .cover-mask,\n.web .cover-wrap {\n  position: relative;\n  width: var(--coverWidth);\n  height: var(--coverHeight);\n}\n\n.web .cover-mask {\n  position: absolute;\n  margin: 0 auto;\n  top: 0 !important;\n  left: 0 !important;\n  border: var(--trimBleed) solid rgba(255, 0, 0, 0.4);\n  border-color: #eaeaea;\n}\n\n.front .logo-icon {\n  height: 6.5%;\n  fill: var(--bgColor);\n  position: absolute;\n  top: 2.75%;\n  right: 0.2in;\n}\n\n.bg-block {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: var(--coverWidth);\n  height: 82%;\n  background: var(--bgColor);\n}\n\n.front,\n.back {\n  position: absolute;\n  top: var(--edgeToSafe);\n  width: var(--safeAreaWidth);\n  height: var(--safeAreaHeight);\n}\n\n.front {\n  text-align: center;\n  right: var(--edgeToSafe);\n}\n\n.back {\n  left: var(--edgeToSafe);\n}\n\n@page {\n  size: var(--coverWidth) var(--coverHeight) landscape;\n  margin: 0;\n}\n\n.title {\n  margin-top: 64%;\n  line-height: 200%;\n  font-size: 0.35in;\n  font-weight: 400;\n  margin-left: 12%;\n  margin-right: 12%;\n  letter-spacing: 0.025in;\n}\n\n.isbn {\n  width: 1.25in;\n  background: white;\n  padding: 0.075in;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n}\n\n" + blurb_css_1["default"] + "\n" + diamond_css_1["default"] + "\n" + author_css_1["default"] + "\n" + initials_css_1["default"] + "\n" + spine_css_1["default"] + "\n" + guides_css_1["default"] + "\n";
exports["default"] = css;
