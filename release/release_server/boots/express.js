"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inject_1 = __importDefault(require("../routes/inject"));
const expressApp = express_1.default();
expressApp.use('/inject', inject_1.default);
exports.default = expressApp;
//# sourceMappingURL=express.js.map