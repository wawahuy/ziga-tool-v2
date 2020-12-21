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
const moment_1 = __importDefault(require("moment"));
const store_1 = require("../helpers/store");
const ziga_key_1 = __importDefault(require("../models/ziga_key"));
const wss = new ws_1.default.Server({ noServer: true });
wss.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    let token = null;
    let emit = (name, data) => {
        socket.send(JSON.stringify({ name, data }));
    };
    emit('version', process.env.VERSION_APP);
    socket.on('message', (dataChunk) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const d = JSON.parse(dataChunk.toString('utf-8'));
            const name = d.name;
            const data = d.data;
            switch (name) {
                case 'auth':
                    const rp = {};
                    const objKey = yield ziga_key_1.default.findOne({ token: data });
                    if (objKey) {
                        if (!objKey.startUse) {
                            console.log('start use');
                            objKey.startUse = moment_1.default().toISOString();
                            yield objKey.save();
                        }
                        rp.currentDate = moment_1.default().toISOString();
                        rp.expireDate = moment_1.default(objKey.startUse).add(objKey.expire, 'days').toISOString();
                        let timeRemaining = moment_1.default.duration(moment_1.default(rp.expireDate).diff(moment_1.default())).asMilliseconds();
                        if (store_1.tokenOpening.find(d => d.token == data)) {
                            rp.status = false;
                            rp.message = 'Token này đang được sử dụng ở máy khác!';
                        }
                        else if (timeRemaining > 0) {
                            rp.status = true;
                            token = data;
                            store_1.tokenOpening.push({
                                token: data,
                                client: socket
                            });
                        }
                        else {
                            rp.status = false;
                            rp.message = 'Token này đã hết hạn sử dụng!';
                        }
                    }
                    else {
                        rp.status = false;
                        rp.message = 'Token không chính xác!';
                    }
                    emit('auth', rp);
                    break;
            }
            common_1.log(d);
        }
        catch (e) {
            common_1.log(e);
        }
    }));
    socket.on('close', () => {
        store_1.remove(socket);
        console.log(store_1.tokenOpening);
    });
    socket.on('error', () => {
        store_1.remove(socket);
        console.log(store_1.tokenOpening);
    });
}));
exports.default = wss;
//# sourceMappingURL=socket.js.map