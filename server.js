const Redis = require("ioredis");
const redisClient = new Redis();
// const io = require('socket.io')({
//   cors: {
//     origin: ['http://localhost:3000']
//   },
//   adapter: require("socket.io-redis")({
//     pubClient: redisClient,
//     subClient: redisClient.duplicate(),
//   }),
// });
const io = require('socket.io')({
  cors: {
    origin: ['http://localhost:3000']
  }
});

// To clear cache
// redisClient.flushdb(function (err, succeeded) {
//   console.log(succeeded); // will be true if successfull
// });

// const { setupWorker } = require("@socket.io/sticky");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { RedisSessionStore } = require("./sessionStore");
const sessionStore = new RedisSessionStore(redisClient);

const { RedisMessageStore } = require("./messageStore");
const messageStore = new RedisMessageStore(redisClient);

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   next();
// });

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      console.log('found session!')
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  console.log('created new session')
  next();
});

io.on("connection", async (socket) => {
  // store session in memory
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // console.log('session', socket.sessionID )

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  const [messages, sessions] = await Promise.all([
    messageStore.findMessagesForUser(socket.userID),
    sessionStore.findAllSessions(),
  ]);
  const messagesPerUser = new Map();
  messages.forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });

  sessions.forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });
  socket.emit("users", users.filter(user => user.connected === true));
  // io.emit("users", users.filter(user => user.connected === true));
  console.log('users', users  )

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to }) => {
    console.log('in pm', content, to)
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    socket.emit("private message", message);
    messageStore.saveMessage(message);
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });
});

// setupWorker(io);


// let numUsers = 0;

// io.on('connection', (socket) => {
//   //initial setup for when a new user connects
//   ++numUsers;
//   socket.emit('login', {
//     numUsers: numUsers
//   });
//   // echo globally (all clients) that a person has connected
//   socket.broadcast.emit('user joined', {
//     username: socket.username,
//     numUsers: numUsers,
//     id: socket.id,
//     connected: true
//   });

//   function getConnectedUsers() {
//     let users = [];
//     for (let [id, socket] of io.of("/").sockets) {
//       users.push({
//         id: id,
//         username: socket.username,
//         connected: true
//       });
//     }
//     console.log('users', users)
//     return users;
    
//   }

  
//   io.emit("users", getConnectedUsers());

//   // when the client emits 'new message', this listens and executes
//   socket.on('new message', (data) => {
//     console.log('new message', data)
//     // we tell the client to execute 'new message'
//     io.emit('new message', {
//       username: socket.username,
//       message: data
//     });
//   });

//   // when the client emits 'private message', this listens and executes
//   socket.on('private message', (data) => {
//     // we tell the client to execute 'new message'
//     // socket.broadcast.emit('new message', {
//     //   username: socket.username,
//     //   message: data
//     // });
//     console.log('in private message', data)
//   });

//   // when the client emits 'add user', this listens and executes
//   socket.on('add user', (username) => {

//     // we store the username in the socket session for this client
//     socket.username = username;
//     ++numUsers;

//     socket.emit('login', {
//       numUsers: numUsers
//     });
    
//     // echo globally (all clients) that a person has connected
//     socket.broadcast.emit('user joined', {
//       username: socket.username,
//       numUsers: numUsers,
//       id: socket.id
//     });
//     // Refresh users
//     socket.emit("users", getConnectedUsers());
//   });

//   // when the client emits 'typing', we broadcast it to others
//   socket.on('typing', () => {
//     socket.broadcast.emit('typing', {
//       username: socket.username
//     });
//   });

//   // when the client emits 'stop typing', we broadcast it to others
//   socket.on('stop typing', () => {
//     socket.broadcast.emit('stop typing', {
//       username: socket.username
//     });
//   });

//   // when the client emits 'mouse activity', we broadcast it to others
//   socket.on('mouse activity', (data) => {
//     socket.broadcast.emit('all mouse activity', {
//       coords: data,
//       user: socket.username,
//       id: socket.id
//     });
//     // console.log(data)
//   });




//   // when the user disconnects.. perform this
//   socket.on('disconnect', () => {

//     --numUsers;

//     // echo globally that this client has left
//     socket.broadcast.emit('user left', {
//       username: socket.username,
//       id: socket.id,
//       numUsers: numUsers
//     });

//     // Refresh users
//     // socket.emit("users", getConnectedUsers());
//     io.emit("users", getConnectedUsers());
//   });
// });


io.listen(3001);


