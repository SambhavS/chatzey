//Libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/newdb');

const PORTNUM = 3000;

//Import static files (js/css/images)
app.use(express.static('public'));

//Serve default page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var curid = 0

//On-Connection Socket Functions
io.on('connection', socket => {
  socket.on('begin session', p => {
    // find new initid;
    Message.find(function (err, messages) {
      if (err) return console.error(err);
      console.log("All previous messages");
      console.log(messages);
    })
  });
  
  socket.on('chat message', msg => {
  	//sends to everyone else
    socket.broadcast.emit('chat message', msg);

    // saves to mongodb!
    var newMsg = new Message({ msg: msg, own: true, number: curid});
    newMsg.save((err, newMsg) => {
      if (err) return console.error(err);
      console.log("Saved Message " + msg);
      curid = curid + 1;
    });

  });
});

//Listener
http.listen(PORTNUM, () => {
  console.log('Listening on localhost: ' + PORTNUM);
});

// Mongoose connection

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongo Coonnnectioned!");
});

var msgSchema = mongoose.Schema({
  msg: String,
  own: Boolean,
  number: Number
});

var Message = mongoose.model('Message', msgSchema);