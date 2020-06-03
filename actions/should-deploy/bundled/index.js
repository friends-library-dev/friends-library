module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(84);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 84:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var pull_requests_1 = __webpack_require__(508);
console.log(pull_requests_1.latestCommitSha());
console.log(process.env.GITHUB_SHA);


/***/ }),

/***/ 508:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(__webpack_require__(747));
function number() {
    var _a;
    var _b = process.env.GITHUB_REF, GITHUB_REF = _b === void 0 ? '' : _b;
    var refMatch = /refs\/pull\/(\d+)\/merge/g.exec(GITHUB_REF);
    if (refMatch) {
        return Number(refMatch[1]);
    }
    var event = getEventJson();
    if ((_a = event === null || event === void 0 ? void 0 : event.pull_request) === null || _a === void 0 ? void 0 : _a.number) {
        return Number(event.pull_request.number);
    }
    return false;
}
exports.number = number;
function latestCommitSha() {
    var _a, _b;
    var event = getEventJson();
    if ((_b = (_a = event === null || event === void 0 ? void 0 : event.pull_request) === null || _a === void 0 ? void 0 : _a.head) === null || _b === void 0 ? void 0 : _b.sha) {
        return String(event.pull_request.head.sha);
    }
    return false;
}
exports.latestCommitSha = latestCommitSha;
function getEventJson() {
    var _a = process.env.GITHUB_EVENT_PATH, GITHUB_EVENT_PATH = _a === void 0 ? '' : _a;
    var contents = fs_1.default.readFileSync(GITHUB_EVENT_PATH, 'utf8');
    console.log(JSON.stringify(JSON.parse(contents), null, 2));
    return JSON.parse(contents);
}


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });