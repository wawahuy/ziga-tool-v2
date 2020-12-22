import { log } from '../helpers/common';
import WebSocket from 'ws';
import * as _ from 'lodash';
import moment from 'moment';
import { tokenOpening, remove } from '../helpers/store';
import ModelZiga from '../models/ziga_key';
export interface IAuth {
  status?: boolean;
  message?: string;
  currentDate?: string;
  expireDate?: string;
}

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (socket) => {
  let token = null;

  let emit = (name: string, data: any) => {
    socket.send(JSON.stringify({ name, data }));
  }

  emit('version', process.env.VERSION_APP);

  socket.on('message', async (dataChunk) => {
    try {
      const d = JSON.parse(dataChunk.toString('utf-8'));
      const name = d.name;
      const data = d.data;

      switch (name) {
        case 'ping':
          emit('pong', {});
          break;

        case 'auth':
          const rp: IAuth = {};
          const objKey = await ModelZiga.findOne({ token: data });

          if (objKey) {
            if (!objKey.startUse) {
              console.log('start use');
              objKey.startUse = moment().toISOString();
              await objKey.save();
            }

            rp.currentDate = moment().toISOString();
            rp.expireDate = moment(objKey.startUse).add(objKey.expire, 'days').toISOString();
            let timeRemaining = moment.duration(moment(rp.expireDate).diff(moment())).asMilliseconds();

            if (tokenOpening.find(d => d.token == data)) {
              rp.status = false;
              rp.message = 'Token này đang được sử dụng ở máy khác!';
            } 
            else if(timeRemaining > 0) {
              rp.status = true;
              token = data;
              tokenOpening.push({
                token: data,
                client: socket
              })
            } else {
              rp.status = false;
              rp.message = 'Token này đã hết hạn sử dụng!';
            }
          } else {
            rp.status = false;
            rp.message = 'Token không chính xác!'
          }
          emit('auth', rp)
          break;
      }

      log(d);
    } catch (e) {
      log(e);
    }
  });

  socket.on('close', () => {
    remove(socket);
    console.log(tokenOpening);
  });

  socket.on('error', () => {
    remove(socket);
    console.log(tokenOpening);
  })
});

export default wss;