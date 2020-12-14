import Http from 'http';
import Express from 'express';

const app = Express();
const server = Http.createServer(app);
const io = require('socket.io')(server);
server.listen(process.env.APP_PORT || -1);


io.on('connection', function(socket){
    console.log('a user connected with id %s', socket.id);
});