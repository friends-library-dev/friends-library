"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
if (typeof window.Asciidoctor !== 'function') {
    throw new Error('Asciidoctor.js must be loaded via a script tag');
}
var instance;
function default_1() {
    if (!instance) {
        // @ts-ignore
        instance = new window.Asciidoctor();
    }
    return instance;
}
exports.default = default_1;
