"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../helpers/common");
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ noServer: true });
wss.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on('message', (dataChunk) => {
        try {
            const d = JSON.parse(dataChunk.toString('utf-8'));
            const name = d.name;
            const data = d.data;
            common_1.log(d);
        }
        catch (e) {
            common_1.log(e);
        }
    });
    socket.on('close', () => {
    });
    socket.on('error', () => {
    });
}));
exports.default = wss;
//# sourceMappingURL=socket.js.map