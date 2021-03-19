const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

let players=[]

io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen trigerred event
    socket.on('setPlayer', (data) => {
        // console.log(data, 'ini dari client');
        //Broadcast
        players.push(data)
        io.emit('player', players)
        // console.log(players)
        // socket.broadcast.emit('player', data)
    })
    socket.on('logout',(data)=>{
      // console.log(data,'logout')
      players=players.filter(player=>player.name!==data)
      // console.log(players,'baru')
      io.emit('player', players)
    })
    socket.on('setScore',(name,score)=>{
      // console.log(name,score,'setScore')
      players.forEach((player)=>{
        if(player.name===name){
          player.score+=score
        }
      })
      // console.log(players,'setScore')
      io.emit('player',players)
    })
    socket.on('setWin',(data)=>{
      let maxSCore = -Infinity
      let nameWin={
        name:'',
        score:0
      }
      if(data==='Selesai'){
        players.forEach((player)=>{
          if(player.score>maxSCore){
            maxSCore=player.score
            nameWin.name=player.name
            nameWin.score=maxSCore
          }
        }
        )
      }
      io.emit('winner',nameWin)
      players = []
      // console.log(nameWin)
    })
})

http.listen(port, () => {
  console.log(`listening on : ${port}`);
});