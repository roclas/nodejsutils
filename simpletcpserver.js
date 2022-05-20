#!/usr/bin/env node

const net = require('net');
const port = 3004;

const server = net.createServer();
server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});

server.on('connection', function(socket) {
    console.log(`connected ${socket.remoteAddress}:${socket.remotePort}`);
    socket.write(`Hello ${socket.remoteAddress}:${socket.remotePort}!!\n\n`);

    socket.on('data', function(chunk) {
        if(!chunk || !`${chunk}`.match(/mypassword/))socket.destroy();
        console.log(`Data received from ${socket.remoteAddress}:${socket.remotePort} => ${chunk.toString()}`);
        //socket.write(`Response to what you said: ${data}`);
        socket.destroy();
    });

    socket.on('end', function() {
        console.log(`Closing connection with ${socket.remoteAddress}:${socket.remotePort}`);
    });

    socket.on('error', function(err) {
        console.log(`Error from: ${socket.remoteAddress}:${socket.remotePort}`);
    });
});

