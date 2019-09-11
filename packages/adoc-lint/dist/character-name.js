"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var unicharadata_1 = __importDefault(require("unicharadata"));
function characterName(char) {
    return unicharadata_1.default.lookupname(char);
}
exports.default = characterName;
