"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var asciidoctor_1 = __importDefault(require("./asciidoctor"));
function convertAsciidoc(adoc) {
    var memoryLogger = asciidoctor_1.default().MemoryLogger.$new();
    asciidoctor_1.default().LoggerManager.setLogger(memoryLogger);
    var html = asciidoctor_1.default().convert(adoc);
    var logs = memoryLogger.getMessages();
    return [html, logs];
}
exports.default = convertAsciidoc;
