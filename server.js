var 		app =	require('http').createServer(handler),
			io	=	require('socket.io').listen(app),
			fs	=	require('fs'),
	connections	=	[];
	
app.listen(8000);

function handler(req, res)
{
	fs.readFile('index.html',
		function(err, data)
		{
			if (err)
			{
				res.writeHead(500);
				return res.end('Error loading file.');
			}
			
			res.writeHead(200);
			res.end(data);
		});
}

io.sockets.on('connection',
	function(socket)
	{
		connections.push(socket);
		
		socket.on('disconnect',
			function()
			{
				connections.splice(connections.indexOf(socket), 1);
			});
		
		console.log(connections.length);
		
		if (connections.length > 0)
		{
			socket.on('Messages',
				function(data)
				{
					connections.forEach(
						function(client)
						{
							client.emit('Notifications', {message: data['message']});
						});
				});
		}
	});


