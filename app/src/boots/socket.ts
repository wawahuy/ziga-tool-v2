import WebSocket from 'ws';
import Player from '../helpers/player';

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (socket) => {
  const player = await Player.get(socket);

  socket.on('message', (dataChunk) => {
    try {
      const d = JSON.parse(dataChunk.toString('utf-8'));
      const name = d.name;
      const data = d.data;
      player.emit(name, data);
      console.log(d);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('close', () => {
    player.close();
  });

  socket.on('error', () => {
    player.close();
  })
});

export default wss;