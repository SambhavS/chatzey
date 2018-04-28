function docReady () {
	var mysocket = io();
	// print out original messages.
	window.name = "bob";
	
	mysocket.emit('begin session', 123);
	mysocket.on('old message', msg => {
		if (msg["name"] == window.name) {
			$('#messages').append($('<li class="ownmessage font-weight-light bg-primary text-light rounded">').text(msg["name"] + ": " + msg["msg"]));
		} else {
			$('#messages').append($('<li class="othermessage bg-light text-dark border rounded">').text(msg["name"] + ": " + msg["msg"]));
		}
	});

	$('.messageform').submit(() => {
		//Calls 'chat message' with typed message as msg
		var msg = $('#m').val();
		if(msg[0] === ":"){
			//User Commands
			var spaceInd = msg.indexOf(" ");
			var command = msg.slice(1, spaceInd);
			//Setname commands
			if(command == "setname" && msg.length > spaceInd + 1 && spaceInd > 0){
				window.name = msg.slice(9);
			}
		}else{
			// Chat message found!
			// send a dictionary that contains both window.name and msg
			msgtable = [window.name, msg]
			mysocket.emit('chat message', msgtable);
			$('#messages').append($('<li class="ownmessage font-weight-light bg-primary text-light rounded">').text(msgtable[0] + ": " + msgtable[1]));
		}
		$('#m').val('');
		return false;
	});
	mysocket.on('chat message', msgtable => {
		$('#messages').append($('<li class="othermessage bg-light text-dark border rounded">').text(msgtable[0] + ": " + msgtable[1]));
	});

}
//Call main function when document is loaded
$(document).ready(docReady);