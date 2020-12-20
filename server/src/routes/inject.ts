import express from 'express';
import { isProduction, log } from '../helpers/common';
import path from 'path';
import fs from 'fs';
const router = express.Router();

router.get('*', (req, res) => {
  let p;
  if (isProduction()) {
    p = path.join(__dirname, '../assets', req.url);
  } else {
    p = path.join(__dirname, '../../../script/dist', req.url);
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