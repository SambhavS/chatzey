//Libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/newdb2');

const PORTNUM = 3000;

//Import static files (js/css/images)
app.use(express.static('public'));

//Serve default page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//On-Connection Socket Functions
io.on('connection', socket => {
  socket.on('begin session', p => {
    // find new initid;
    Message.find(function (err, messages) {
      if (err) return console.error(err);
      console.log("All previous messages");
      console.log(messages);

      console.log("Appending previous messages...");

      for(var i = 0, size = messages.length; i < size ; i++){
        var msgdict = messages[i];
        socket.emit("old message", msgdict);
     }

    })
  });
  
  socket.on('chat message', msgtable => {
  	//sends to everyone else
    socket.broadcast.emit('chat message', msgtable);

    // saves to mongodb!
    // TODO: own is always to true now!
    var newMsg = new Message({ name: msgtable[0], msg: msgtable[1] });

    newMsg.save((err, newMsg) => {
      if (err) return console.error(err);
      console.log("Message By: " + msgtable[0]);
      console.log("Message Of: " + msgtable[1]);
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
  name: String,
  msg: String
});

var Message = mongoose.model('Message', msgSchema);