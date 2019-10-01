// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var cron = require('node-cron');
 
cron.schedule('*/15 * * * *', () => {
	players = {};
	count =0;
  //console.log('restarting server every fifteen minutes');
});


app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
var count=0;
var players = {};
io.on('connection', function(socket) {
   // console.log("socketId: "+socket.id);  
   
  socket.on('new player', function(playerName) {
    //var newname=count+' '+playerName;
   // console.log(newname);
    //console.log(count);
    
    players[socket.id] = {
      x: 300,
      y: 300,
      num:count,
      name:playerName,
      score:0
    };
    count++;
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -=1;
     
    }
    if (data.up) {
      player.y -=1;
     
    }
    if (data.right) {
      player.x +=1;
     
    }
    if (data.down) {
      player.y +=1;
      
    }
  });
  socket.on('score',function(data){
  players[data].score+=1;
});
});


setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

setInterval(function() {
  io.sockets.emit('winner', players);
}, 1000 /60);
