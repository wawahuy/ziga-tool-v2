import http from 'http';
import url from 'url';
import Mongoose from 'mongoose';
import expressApp from './express';
import wss from './socket';
import { log } from '../helpers/common';

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

/// start mongoose
Mongoose.connect(
  process.env.MONGO_URI as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  (err) => {
    if (err) {
      console.log('db fail')
    } else {
      console.log('db ok')
    }
  }
);
Mongoose.Promise = global.Promise;