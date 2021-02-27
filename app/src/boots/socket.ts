import { log } from '../helpers/common';
import WebSocket from 'ws';
import moment from 'moment';
import Player from '../helpers/player';
import { IAuth, SocketClientServer } from '../helpers/socket_server';
const wss = new WebSocket.Server({ noServer: true });

enum EMessageType {
  SUCCESS,
  WARNING,
  ERROR
}

wss.on('connection', async (socket) => {
  let player: Player;
  let auth = false;
  let toExpire: NodeJS.Timeout;

  let emit = (name: string, data: any) => {
    socket.send(JSON.stringify({ name, data }));
  }

  let message = (type: EMessageType, m: string, autoHide = true) => {
    emit('message', {
      type,
      message: m,
      autoHide
    })
  }

  socket.on('message', async (dataChunk) => {
    try {
      const d = JSON.parse(dataChunk.toString('utf-8'));
      const name = d.name;
      const data = d.data;
      log(d);

      if (name == 'auth' && !auth) {
        player = await Player.get(socket);
        auth = true;
        emit('auth', { 
          auth: true, 
          message: "Xác thực thành công",
          timeRemaining: 2147483640
        });
      }

      if (auth) {
        player?.emit(name, data);
      }
    } catch (e) {
      log(e);
    }
  });

  socket.on('close', () => {
    player?.close();
    clearTimeout(toExpire);
  });

  socket.on('error', () => {
    player?.close();
    clearTimeout(toExpire);
  })
});

export default wss;