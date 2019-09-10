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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
function getEnv(required) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
    var obj = {};
    keys.forEach(function (key) {
        var val = process.env[key];
        if (required && typeof val !== 'string') {
            throw new Error("Env var `" + key + "` is required.");
        }
        obj[key] = typeof val === 'string' ? val : '';
    });
    return obj;
}
var get = function () {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    return getEnv.apply(void 0, __spread([false], keys));
};
var req = function () {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    return getEnv.apply(void 0, __spread([true], keys));
};
exports.default = {
    get: get,
    require: req,
};
