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
  let socketClientServer: SocketClientServer = new SocketClientServer;
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

  socketClientServer.on('open', () => {
    message(EMessageType.SUCCESS, 'Kết nối đến sever thành công!');
  });

  socketClientServer.on('close', () => {
    message(EMessageType.ERROR, 'Đã bị mât kết nối đến server!');
  });

  socketClientServer.on('version', (version: string) => {
    if (version != process.env.VERSION_APP) {
      const link = process.env.SERVER_URL + '/download';
      message(EMessageType.ERROR, `Đã có phiên bản mới bạn vui lòng cập nhật tại: ${link}`, false);
      socket?.close();
    }
  });

  socketClientServer.on('auth',  async (d: IAuth) => {
    if (d?.status) {
      auth = true;
      if (!player) {
        player = await Player.get(socket)
      }
      const maxTimeRemaining = 2147483640;
      const timeRemaining = moment.duration(moment(d.expireDate).diff(moment(d.currentDate))).asMilliseconds();
      toExpire = setTimeout(() => {
        message(EMessageType.WARNING, 'Token của bạn đã hết hạn!');
        socket.close();
      }, timeRemaining > maxTimeRemaining ? maxTimeRemaining : timeRemaining);
      emit('auth', { 
        auth, 
        message: "Xác thực thành công",
        timeRemaining
      });
    } else {
      emit('auth', { 
        auth, 
        message: d.message
      });
    }
  });

  socket.on('message', async (dataChunk) => {
    try {
      const d = JSON.parse(dataChunk.toString('utf-8'));
      const name = d.name;
      const data = d.data;
      log(d);

      if (name == 'auth' && !auth) {
        if (!socketClientServer.isOpen) {
          message(EMessageType.ERROR, 'Không thể kêt nối đến server!');
          emit('auth', { auth: false, message: 'Không thể xác thực!' });
        } else {
          socketClientServer.auth(data);
        }
      }

      if (name == 'startcotuong') {
        if (!socketClientServer.isOpen) {
          message(EMessageType.ERROR, 'Không thể kêt nối đến server!');
          socket.close();
          return;
        }
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
    socketClientServer?.close();
    clearTimeout(toExpire);
  });

  socket.on('error', () => {
    player?.close();
    socketClientServer?.close();
    clearTimeout(toExpire);
  })
});

export default wss;