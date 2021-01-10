"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.tokenOpening = void 0;
exports.tokenOpening = [];
const remove = (socket) => {
    exports.tokenOpening = exports.tokenOpening.filter(o => o.client != socket);
};
exports.remove = remove;
//# sourceMappingURL=store.js.map