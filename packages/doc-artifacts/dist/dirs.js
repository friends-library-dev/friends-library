"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
function dirs(opts) {
    var namespace = opts.namespace || "ns_auto_gen_" + Date.now();
    var srcPath = opts.srcPath || "src_path_auto_gen_" + Date.now();
    var ROOT_DIR = path_1.default.resolve(__dirname, '..', 'artifacts');
    var ARTIFACT_DIR = path_1.default.resolve(ROOT_DIR, namespace);
    var SRC_DIR = path_1.default.resolve(ARTIFACT_DIR, 'src', srcPath);
    return { ARTIFACT_DIR: ARTIFACT_DIR, SRC_DIR: SRC_DIR };
}
exports.dirs = dirs;
function deleteNamespaceDir(namespace) {
    var ARTIFACT_DIR = dirs({ namespace: namespace }).ARTIFACT_DIR;
    fs_extra_1.default.removeSync(ARTIFACT_DIR);
}
exports.deleteNamespaceDir = deleteNamespaceDir;
