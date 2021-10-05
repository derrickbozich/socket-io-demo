const io = require('socket.io')({
  cors: {
    origin: ['http://localhost:3000']
  }
});

// On the server-side, we register a middleware which 
// checks the username and allows the connection:

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on('connection', socket => {
  
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });


  // notify existing users
  socket.broadcast.emit("user connected", {
  // socket.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      connected: true,
      messages: []
    });
  }
  socket.emit("users", users);

  // notify users upon disconnection
  socket.on("disconnect", () => {
    // console.log('disconnect', socket.id)

    socket.broadcast.emit("user disconnected", socket.id);

  });

});

io.listen(3001);

