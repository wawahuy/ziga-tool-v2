import express from 'express';
import { isProduction, log } from '../helpers/common';
import request from 'request';
import fs from 'fs';
import Path from 'path';
const router = express.Router();

router.get('*', (req, res) => {
  const path = req.url;
  if (isProduction()) {
    const p = Path.join(process.cwd(), 'assets', path);
    if (fs.existsSync(p) && fs.statSync(p).isFile) {
      fs.createReadStream(p).pipe(res);
    } else {
      res.status(404).send(p);
    }
    return;
  }

  let host = process.env.INJECT_PUBLIC_URL as string + '/inject';
  const url = host + path;
  const getContent = request(url, function (error, response, body) {
    if (error) {
      log(error);
      res.status(404).json('I dont have that');
    }
  });
  req.pipe(getContent).pipe(res);
});

export default router;