import path from 'path';
import fs from 'fs';

/// parsed .env file in app
const pathAppENV = path.join(__dirname, '/.env');
if (fs.existsSync(pathAppENV)) {
	const envDefined = require('dotenv').config( {
		path: pathAppENV
	}).parsed;
  process.env = Object.assign(process.env || {}, envDefined);
  process.env.IS_APP = "app";
}


// boots
import './boots';
import './helpers/player';

console.log('Vui lòng không tắt ứng dụng này khi bạn còn đang hack!');