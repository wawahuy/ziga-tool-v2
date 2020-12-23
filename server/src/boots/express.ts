import Express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isProduction } from '../helpers/common';
import routeInject from '../routes/inject';
import { tokenOpening } from '../helpers/store';
import ModelZiga from '../models/ziga_key';
import ModelZigaRelease from '../models/ziga_release';

const expressApp = Express();
expressApp.use('/inject', routeInject);

expressApp.get('/download', async (req, res) => {
  const conf = await ModelZigaRelease.findOne({});
  if (conf && conf.download) {
    res.redirect(conf.download);
  } else {
    res.status(404).send("Không có version tải!");
  }
})


/// fast build mgnt
const mdw = function (req: Request, res: Response, next: any) {
  const l1 = req.query.l1;
  const l2 = req.query.l2;
  const pwd = req.query.pwd;
  if (l1 === 'yuh' && l2 === '123' && pwd == 'huy') {
    next();
  } else {
    res.status(404).send();
  }
}

expressApp.get('/mnt/clients', mdw,  (req, res) => {
  res.json({
    client: tokenOpening.length,
    tokens: tokenOpening.map(o => o.token)
  });
});


expressApp.get('/mnt/gen', mdw, async (req, res) => {
  const date = req.query.date;
  const phone = req.query.phone as string;
  const token = uuidv4();

  if (!date || !phone) {
    res.status(404).send();
    return;
  }

  const model = new ModelZiga;
  model.token = token;
  model.expire = Number(date);
  model.phone =  phone;
  await model.save();

  res.json({
    token,
    phone,
    expireDate: date
  });
});

expressApp.get('/mnt/setDown', mdw, async (req, res) => {
  const download = req.query.download;

  if (!download) {
    res.status(404).send();
    return;
  }

  const model = await ModelZigaRelease.findOne() || new ModelZigaRelease;
  model.download = download as string;
  await model.save();

  res.json({ download });
});


expressApp.get('/', async (req, res) => {
  res.redirect('https://www.youtube.com/watch?v=lQssarw-zug&t=46s&ab_channel=CodeYUH');
})

export default expressApp;