"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var asciidoctor_convert_1 = __importDefault(require("./asciidoctor-convert"));
var post_process_html_1 = require("./post-process-html");
var prepare_adoc_1 = require("./prepare-adoc");
var adocToHtml = lodash_1.memoize(function (adoc) {
    var prepared = prepare_adoc_1.prepareAsciidoc(adoc);
    var _a = __read(asciidoctor_convert_1.default(prepared), 2), html = _a[0], logs = _a[1];
    return [post_process_html_1.postProcessHtml(html), logs];
});
exports.default = adocToHtml;
