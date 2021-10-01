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


  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
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
    // const matchingSockets = await io.in(socket.userID).allSockets();
    // const isDisconnected = matchingSockets.size === 0;
    // if (isDisconnected) {
    //   // notify other users
    //   socket.broadcast.emit("user disconnected", socket.userID);
    // }

    socket.broadcast.emit("user disconnected", socket.userID);
  });

});

io.listen(3001);

