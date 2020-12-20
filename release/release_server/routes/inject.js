"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const common_1 = require("../helpers/common");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.get('*', (req, res) => {
    let p;
    if (common_1.isProduction()) {
        p = path_1.default.join(__dirname, '../assets', req.url);
    }
    else {
        p = path_1.default.join(__dirname, '../../../script/dist', req.url);
    }
    common_1.log(p);
    if (fs_1.default.existsSync(p)) {
        const stream = fs_1.default.createReadStream(p);
        stream.pipe(res);
    }
    else {
        res.status(404).send('No assets');
    }
});
exports.default = router;
//# sourceMappingURL=inject.js.map