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
import { getPath, log } from './helpers/common';

/**
 * Check resource
 */
 (() => {
  const assets = [
    {
      name: 'nnue',
      path: getPath('/file1.nnue')
    },
    {
      name: 'engine v14',
      path: getPath('/ucci14.exe')
    },
  ];
  assets.map((asset) => {
    console.log('Load', asset.name, 'at', asset.path);
    if (!fs.existsSync(asset.path) || !fs.statSync(asset.path)) {
      console.log('FAILED');
      process.exit(-1);
    }
  })
})();


console.log('Vui lòng không tắt ứng dụng này khi bạn còn đang hack!');