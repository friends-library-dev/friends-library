"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var core_1 = __importDefault(require("@asciidoctor/core"));
var instance;
function default_1() {
    if (!instance) {
        // @ts-ignore
        instance = new core_1.default();
    }
    return instance;
}
exports.default = default_1;
