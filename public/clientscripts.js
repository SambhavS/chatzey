function docReady () {
	var mysocket = io();

	// print out original messages.
	mysocket.emit('begin session', 123);

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
			mysocket.emit('chat message', window.name + ": " + msg);
			$('#messages').append($('<li class="ownmessage font-weight-light bg-primary text-light rounded">').text(msg));
		}
		$('#m').val('');
		return false;
	});
	mysocket.on('chat message', msg => {
		$('#messages').append($('<li class="othermessage bg-light text-dark border rounded">').text(msg));
	});

}
//Call main function when document is loaded
$(document).ready(docReady);