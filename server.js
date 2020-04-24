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
app.use('/icon', express.static(__dirname + '/static/icon.png'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'intro.html'));
});

app.get('/go', function(request, response) {
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
      x: 700,
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
      player.x =(player.x + (1500-5)) %1500;
     
    }
    if (data.up) {
      player.y =(player.y + (650-5)) % 650;
     
    }
    if (data.right) {
      player.x = (player.x + 5)%1500;
     
    }
    if (data.down) {
      player.y = (player.y + 5)%650;
      
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
