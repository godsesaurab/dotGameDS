// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var cron = require('node-cron');
var redis = require('redis');
var client = redis.createClient();



//cron
cron.schedule('*/15 * * * *', () => {
	client.flushall();
	count=0;
   players = {};
});



//express app initialising
app.set('port', 5003);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'intro.html'));
});

app.get('/go', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
//listening
server.listen(5003, function() {
  console.log('Starting server on port 5003');
});


//initialising with empty and zero
var count=0;
var players = {};

    



//sockets starts
io.on('connection', function(socket) {
   // console.log("socketId: "+socket.id);  
   
//taking values from redis server caches
     client.get('count', function(err, reply) {
	  if(reply!=undefined){
	  count= parseInt(reply);
	  }
    });
     client.hgetall('players',function(err,object){
      if(object!=undefined){
     	players= JSON.parse(object['all']);
      }
    });
  //new player socket 
   socket.on('new player', function(playerName) {

    players[socket.id] =  {
      x: 700,
      y: 300,
      num:count,
      name:playerName,
      score:0
    };
    count++;
    
    //setting new values to redis cache
     client.set('count', count);
     client.hset('players','all',JSON.stringify(players));

  });

  //on movement socket
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -=5;
     
    }
    if (data.up) {
      player.y -=5;
     
    }
    if (data.right) {
      player.x +=5;
     
    }
    if (data.down) {
      player.y +=5;
      
    }
    
    //setting new movements to cache
    client.hset('players','all',JSON.stringify(players));
  });

  //scoring socket call
  socket.on('score',function(data){
  players[data].score+=1;
  //setting new scores to cache
    client.hset('players','all',JSON.stringify(players));
  });
});


setInterval(function() {
 
 //taking values from redis server caches
     client.get('count', function(err, reply) {
	  if(reply!=undefined){
	  count= parseInt(reply);
	  }
    });
     client.hgetall('players',function(err,object){
      if(object!=undefined){
     	players= JSON.parse(object['all']);
      }
    });


  io.sockets.emit('state', players);
  
}, 1000 / 60);

setInterval(function() {
  io.sockets.emit('winner', players);
}, 1000 /60);
