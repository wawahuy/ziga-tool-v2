import express from 'express';
import { log } from '../helpers/common';
import request from 'request';
const router = express.Router();

router.get('*', (req, res) => {
  const path = req.url;
  const url = process.env.SERVER_URL + '/inject' + path;
  const getContent = request(url, function (error, response, body) {
    if (error) {
      log(error);
      res.status(404).json('I dont have that');
    }
  });
  req.pipe(getContent).pipe(res);
});

export default router;