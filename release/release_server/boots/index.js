"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../helpers/common");
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const express_1 = __importDefault(require("./express"));
const socket_1 = __importDefault(require("./socket"));
const server = http_1.default.createServer(express_1.default);
server.listen((process.env.SERVER_PORT || -1), "0.0.0.0", () => {
    common_1.log("Express listening...", process.env.SERVER_PORT);
});
server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url_1.default.parse(request.url).pathname;
    if (pathname === '/ws') {
        socket_1.default.handleUpgrade(request, socket, head, function done(ws) {
            socket_1.default.emit('connection', ws, request);
        });
    }
});
//# sourceMappingURL=index.js.map