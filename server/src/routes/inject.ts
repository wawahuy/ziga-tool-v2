import express from 'express';
import { isProduction, log } from '../helpers/common';
import path from 'path';
import fs from 'fs';
const router = express.Router();

router.get('*', (req, res) => {
  let p;
  let url = req.url.replace(/\.\./g, '');
  if (isProduction()) {
    p = path.join(__dirname, '../assets', url);
  } else {
    p = path.join(__dirname, '../../../script/dist', url);
  }

  log(p);
  if (fs.existsSync(p)) {
    const stream = fs.createReadStream(p);
    stream.pipe(res);
  } else {
    res.status(404).send('No assets');
  }
});

export default router;