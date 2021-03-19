const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen trigerred event
    socket.on('setPlayer', (data) => {
        console.log(data, 'ini dari client');
        //Broadcast
        io.emit('player', data)
        // socket.broadcast.emit('player', data)
    })
})

http.listen(port, () => {
  console.log(`listening on : ${port}`);
});