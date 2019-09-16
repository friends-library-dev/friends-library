"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeReduceWrapper(before, after) {
    return function (acc, str, index, array) {
        if (acc === void 0) { acc = []; }
        index === 0 && acc.unshift(before);
        acc.push(str);
        index === array.length - 1 && acc.push(after);
        return acc;
    };
}
exports.makeReduceWrapper = makeReduceWrapper;
