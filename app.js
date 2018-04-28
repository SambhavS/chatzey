//Libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORTNUM = 3000;

//Import static files (js/css/images)
app.use(express.static('public'));

//Serve default page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//On-Connection Socket Functions
io.on('connection', socket => {
  socket.on('chat message', msg => {
  	//sends to everyone else
    socket.broadcast.emit('chat message', msg);
  });
});

//Listener
http.listen(PORTNUM, () => {
  console.log('Listening on localhost: ' + PORTNUM);
});