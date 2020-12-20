import express from 'express';
import { isProduction, log } from '../helpers/common';
import request from 'request';
const router = express.Router();

router.get('*', (req, res) => {
  let host = process.env.SERVER_URL + '/inject';
  if (!isProduction()) {
    host = process.env.INJECT_PUBLIC_URL as string;
  }
  const path = req.url;
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