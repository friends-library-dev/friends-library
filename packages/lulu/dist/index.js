"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaultMargins = {
    top: 0.85,
    bottom: 0.65,
    outer: 0.6,
    inner: 0.7,
    runningHeadTop: 0.35,
};
exports.sizes = {
    s: {
        luluName: 'Pocket Book',
        abbrev: 's',
        minPages: 2,
        maxPages: 175,
        margins: {
            top: 0.68,
            bottom: 0.52,
            outer: 0.48,
            inner: 0.528,
            runningHeadTop: 0.18,
        },
        dims: {
            height: 6.875,
            width: 4.24,
        },
    },
    m: {
        minPages: 100,
        maxPages: 450,
        luluName: 'Digest',
        abbrev: 'm',
        margins: defaultMargins,
        dims: {
            height: 8.5,
            width: 5.5,
        },
    },
    xl: {
        minPages: 350,
        maxPages: 2000,
        luluName: 'US Trade',
        abbrev: 'xl',
        margins: defaultMargins,
        dims: {
            height: 9,
            width: 6,
        },
    },
};
function choosePrintSize(pages) {
    var size = 's';
    if (pages.s > exports.sizes.s.maxPages)
        size = 'm';
    if (pages.m > exports.sizes.m.maxPages)
        size = 'xl';
    return size;
}
exports.choosePrintSize = choosePrintSize;
function getPrintSizeDetails(id) {
    var size;
    Object.values(exports.sizes).forEach(function (s) {
        if (s && (s.luluName === id || s.abbrev === id)) {
            size = s;
        }
    });
    if (!size) {
        throw new Error("Unknown print size identifier: \"" + id + "\"");
    }
    return size;
}
exports.getPrintSizeDetails = getPrintSizeDetails;
