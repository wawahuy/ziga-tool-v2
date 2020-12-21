"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("./express"));
const socket_1 = __importDefault(require("./socket"));
const common_1 = require("../helpers/common");
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
mongoose_1.default.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) {
        console.log('db fail');
    }
    else {
        console.log('db ok');
    }
});
mongoose_1.default.Promise = global.Promise;
//# sourceMappingURL=index.js.map