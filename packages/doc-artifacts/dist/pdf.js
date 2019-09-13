"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var env_1 = __importDefault(require("@friends-library/env"));
var color_1 = require("@friends-library/cli-utils/color");
function pdf(manifest, filename, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = dirs(opts), ARTIFACT_DIR = _a.ARTIFACT_DIR, SRC_DIR = _a.SRC_DIR;
    console.log({ ARTIFACT_DIR: ARTIFACT_DIR, SRC_DIR: SRC_DIR });
    fs_extra_1.default.ensureDirSync(SRC_DIR);
    var writeFiles = Promise.all(Object.keys(manifest).map(function (path) {
        return fs_extra_1.default.outputFile(SRC_DIR + "/" + path, manifest[path], path.endsWith('.png') ? 'binary' : undefined);
    }));
    var PRINCE_BIN = env_1.default.require('PRINCE_BIN').PRINCE_BIN;
    return writeFiles
        .then(function () {
        var src = SRC_DIR + "/doc.html";
        var stream = child_process_1.spawn(PRINCE_BIN || '/usr/local/bin/prince-books', [src]);
        var output = '';
        return new Promise(function (resolve, reject) {
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
        });
    })
        .then(function () {
        return fs_extra_1.default.move(SRC_DIR + "/doc.pdf", ARTIFACT_DIR + "/" + filename + ".pdf");
    })
        .then(function () {
        return ARTIFACT_DIR + "/" + filename + ".pdf";
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
function dirs(opts) {
    var namespace = opts.namespace || "ns_auto_gen_" + Date.now();
    var srcPath = opts.srcPath || "src_path_auto_gen_" + Date.now();
    var ROOT_DIR = path_1.default.resolve(__dirname, '..', 'artifacts');
    var ARTIFACT_DIR = path_1.default.resolve(ROOT_DIR, namespace);
    var SRC_DIR = path_1.default.resolve(ARTIFACT_DIR, 'src', srcPath);
    return { ARTIFACT_DIR: ARTIFACT_DIR, SRC_DIR: SRC_DIR };
}
