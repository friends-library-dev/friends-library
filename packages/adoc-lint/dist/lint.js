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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lineLints = __importStar(require("./line-rules"));
var blockLints = __importStar(require("./block-rules"));
function lint(adoc, options) {
    if (options === void 0) { options = { lang: 'en' }; }
    var lineRules = Object.values(lineLints);
    var lines = adoc.split('\n');
    var lineResults = lines.reduce(function (acc, line, index) {
        if (isLintComment(line)) {
            return acc;
        }
        if (isComment(line)) {
            acc.push(commentWarning(index + 1));
            return acc;
        }
        lineRules.forEach(function (rule) {
            if (runRule(rule, options, lines[index - 1])) {
                var ruleResults = rule(line, lines, index + 1, options);
                ruleResults.forEach(function (result) { return acc.push(result); });
            }
        });
        return acc;
    }, []);
    var blockRules = Object.values(blockLints);
    var blockResults = blockRules.reduce(function (acc, rule) {
        if (!runRule(rule, options)) {
            return acc;
        }
        return acc.concat.apply(acc, __spread(rule(adoc, options)));
    }, []);
    return __spread(lineResults, blockResults);
}
exports.default = lint;
function runRule(rule, options, prevLine) {
    var include = options.include, exclude = options.exclude;
    if (rule.maybe && !options.maybe && !(include || []).includes(rule.slug)) {
        return false;
    }
    if (disabledByComment(rule.slug, prevLine)) {
        return false;
    }
    if (include === undefined && exclude === undefined) {
        return true;
    }
    if (include && !include.includes(rule.slug)) {
        return false;
    }
    if (exclude && exclude.includes(rule.slug)) {
        return false;
    }
    return true;
}
function disabledByComment(ruleSlug, prevLine) {
    return !!(prevLine &&
        prevLine[0] === '/' &&
        prevLine.match(new RegExp("^// lint-disable .*" + ruleSlug)));
}
function isLintComment(line) {
    return isComment(line) && !!line.match(/lint-(disable|ignore)/);
}
function isComment(line) {
    return line[0] === '/' && line[1] === '/';
}
function commentWarning(lineNumber) {
    return {
        line: lineNumber,
        column: false,
        type: 'warning',
        rule: 'temporary-comments',
        message: 'Comments should generally be removed, with the exceptions of: 1) comments to disable lint rules (e.g. `// lint-disable invalid-characters`), and 2) special cases where there would be a long-term value to keeping the comment (these lines can be marked with `--lint-ignore` to disable this lint warning)',
    };
}
