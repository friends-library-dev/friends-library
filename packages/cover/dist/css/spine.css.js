"use strict";
exports.__esModule = true;
var css = "\n.spine {\n  width: var(--spineWidth);\n  height: var(--bookHeight);\n  position: absolute;\n  top: var(--trimBleed);\n  left: var(--edgeToSpine);\n}\n\n.spine .logo-icon {\n  display: var(--spineDisplay);\n  height: 3.5%;\n  fill: white;\n  position: absolute;\n  bottom: var(--edgeToSafe);\n  left: 50%;\n  transform: translateX(-44%);\n}\n\n.spine__title {\n  display: var(--spineDisplay);\n  left: 50%;\n  transform: translateX(-50%);\n  margin: 0;\n  position: absolute;\n  writing-mode: vertical-rl;\n  line-height: var(--spineWidth);\n  font-size: 0.26in;\n  top: 20%;\n}\n";
exports["default"] = css;
