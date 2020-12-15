import Http from 'http';
import Express from 'express';
import { Socket } from 'socket.io';
import path from 'path';

/// parsed .env file in app
const envDefined = require('dotenv').config( {
    path: path.join(__dirname, '/.env')
}).parsed;
process.env = Object.assign(process.env || {}, envDefined);

// boots
const app = Express();
const server = Http.createServer(app);
const io = require('socket.io')(server);
server.listen(process.env.APP_PORT || -1);


io.on('connection', function(socket: Socket){
    console.log('a user connected with id %s', socket.id);
});