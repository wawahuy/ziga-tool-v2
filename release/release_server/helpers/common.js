"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.isApp = exports.isProduction = void 0;
function isProduction() {
    return process.env.ENV === 'prod';
}
exports.isProduction = isProduction;
function isApp() {
    return process.env.IS_APP === "app";
}
exports.isApp = isApp;
function log(...args) {
    if (!isProduction()) {
        console.log(...args);
    }
}
exports.log = log;
//# sourceMappingURL=common.js.map