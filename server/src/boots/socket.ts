import { log } from '../helpers/common';
import WebSocket from 'ws';

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (socket) => {

  socket.on('message', (dataChunk) => {
    try {
      const d = JSON.parse(dataChunk.toString('utf-8'));
      const name = d.name;
      const data = d.data;
      log(d);
    } catch (e) {
      log(e);
    }
  });

  socket.on('close', () => {
  });

  socket.on('error', () => {
  })
});

export default wss;