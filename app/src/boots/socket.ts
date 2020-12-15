import WebSocket from 'ws';

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (socket) => {
  socket.on('message', (data) => {
  });
});

export default wss;