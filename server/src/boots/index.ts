import { log } from '../helpers/common';
import http from 'http';
import url from 'url';
import expressApp from './express';
import wss from './socket';

const server = http.createServer(expressApp);

server.listen(
  (process.env.SERVER_PORT || -1) as number,
  "0.0.0.0",
  () => {
    log("Express listening...", process.env.SERVER_PORT)
  }
)


server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  }
});