"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var child_process_1 = require("child_process");
var env_1 = __importDefault(require("@friends-library/env"));
var color_1 = require("@friends-library/cli-utils/color");
var dirs_1 = require("./dirs");
function pdf(manifest, filenameNoExt, opts) {
    if (opts === void 0) { opts = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, ARTIFACT_DIR, SRC_DIR, writeFiles, PRINCE_BIN, src, stream, output;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = dirs_1.dirs(opts), ARTIFACT_DIR = _a.ARTIFACT_DIR, SRC_DIR = _a.SRC_DIR;
                    fs_extra_1.default.ensureDirSync(SRC_DIR);
                    writeFiles = Promise.all(Object.keys(manifest).map(function (path) {
                        return fs_extra_1.default.outputFile(SRC_DIR + "/" + path, manifest[path], path.endsWith('.png') ? 'binary' : undefined);
                    }));
                    PRINCE_BIN = env_1.default.require('PRINCE_BIN').PRINCE_BIN;
                    return [4 /*yield*/, writeFiles];
                case 1:
                    _b.sent();
                    src = SRC_DIR + "/doc.html";
                    stream = child_process_1.spawn(PRINCE_BIN || '/usr/local/bin/prince-books', [src]);
                    output = '';
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            stream.stderr.on('data', function (data) {
                                output = output.concat(data.toString());
                            });
                            stream.on('close', function (code) {
                                output = output
                                    .trim()
                                    .split('\n')
                                    .filter(filterPrinceOutput)
                                    .map(opts.formatOutput || (function (l) { return l; }))
                                    .join('\n');
                                if (output) {
                                    color_1.yellow(output);
                                }
                                return code === 0 ? resolve() : reject(new Error("prince-books error " + code));
                            });
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, fs_extra_1.default.move(SRC_DIR + "/doc.pdf", ARTIFACT_DIR + "/" + filenameNoExt + ".pdf")];
                case 3:
                    _b.sent();
                    return [2 /*return*/, ARTIFACT_DIR + "/" + filenameNoExt + ".pdf"];
            }
        });
    });
}
exports.default = pdf;
function filterPrinceOutput(line) {
    if (line.trim() === '') {
        return false;
    }
    if (line.match(/^prince: warning: cannot fit footnote\(s\) on page/)) {
        return false;
    }
    return true;
}
