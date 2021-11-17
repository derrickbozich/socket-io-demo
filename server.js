const io = require('socket.io')({
  cors: {
    origin: ['http://localhost:3000']
  }
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

let numUsers = 0;

io.on('connection', (socket) => {
  //initial setup for when a new user connects
  ++numUsers;
  socket.emit('login', {
    numUsers: numUsers
  });
  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUsers: numUsers,
    id: socket.id,
    connected: true
  });

  function getConnectedUsers() {
    let users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        id: id,
        username: socket.username,
        connected: true
      });
    }
    console.log('users', users)
    return users;
    
  }

  
  io.emit("users", getConnectedUsers());

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    console.log('new message', data)
    // we tell the client to execute 'new message'
    io.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'private message', this listens and executes
  socket.on('private message', (data) => {
    // we tell the client to execute 'new message'
    // socket.broadcast.emit('new message', {
    //   username: socket.username,
    //   message: data
    // });
    console.log('in private message', data)
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;

    socket.emit('login', {
      numUsers: numUsers
    });
    
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      id: socket.id
    });
    // Refresh users
    socket.emit("users", getConnectedUsers());
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the client emits 'mouse activity', we broadcast it to others
  socket.on('mouse activity', (data) => {
    socket.broadcast.emit('all mouse activity', {
      coords: data,
      user: socket.username,
      id: socket.id
    });
    // console.log(data)
  });




  // when the user disconnects.. perform this
  socket.on('disconnect', () => {

    --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      id: socket.id,
      numUsers: numUsers
    });

    // Refresh users
    // socket.emit("users", getConnectedUsers());
    io.emit("users", getConnectedUsers());
  });
});


io.listen(3001);


