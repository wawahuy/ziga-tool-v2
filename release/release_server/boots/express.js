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
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const inject_1 = __importDefault(require("../routes/inject"));
const store_1 = require("../helpers/store");
const ziga_key_1 = __importDefault(require("../models/ziga_key"));
const ziga_release_1 = __importDefault(require("../models/ziga_release"));
const expressApp = express_1.default();
expressApp.use('/inject', inject_1.default);
expressApp.get('/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conf = yield ziga_release_1.default.findOne({});
    if (conf && conf.download) {
        res.redirect(conf.download);
    }
    else {
        res.status(404).send("Không có version tải!");
    }
}));
const mdw = function (req, res, next) {
    const l1 = req.query.l1;
    const l2 = req.query.l2;
    const pwd = req.query.pwd;
    if (l1 === 'yuh' && l2 === '123' && pwd == 'huy') {
        next();
    }
    else {
        res.status(404).send();
    }
};
expressApp.get('/mnt/clients', mdw, (req, res) => {
    res.json({
        client: store_1.tokenOpening.length,
        tokens: store_1.tokenOpening.map(o => o.token)
    });
});
expressApp.get('/mnt/gen', mdw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.query.date;
    const phone = req.query.phone;
    const token = uuid_1.v4();
    if (!date || !phone) {
        res.status(404).send();
        return;
    }
    const model = new ziga_key_1.default;
    model.token = token;
    model.expire = Number(date);
    model.phone = phone;
    yield model.save();
    res.json({
        token,
        phone,
        expireDate: date
    });
}));
expressApp.get('/mnt/setDown', mdw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const download = req.query.download;
    if (!download) {
        res.status(404).send();
        return;
    }
    const model = (yield ziga_release_1.default.findOne()) || new ziga_release_1.default;
    model.download = download;
    yield model.save();
    res.json({ download });
}));
exports.default = expressApp;
//# sourceMappingURL=express.js.map