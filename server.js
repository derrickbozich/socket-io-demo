const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    // origin: ['http://localhost:3000']
    origin: true
  }
});

const Redis = require("ioredis");
const redisClient = new Redis();

// Instantiate server module object
let server = {};
server.httpServer = httpServer;

// const io = require('socket.io')({
//   cors: {
//     origin: ['http://localhost:3000']
//   },
//   adapter: require("socket.io-redis")({
//     pubClient: redisClient,
//     subClient: redisClient.duplicate(),
//   }),
// });

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

const findOrCreateSession = async (socket, next) => {
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

}

// Middlware for every socket event
io.use(async (socket, next) => {
  findOrCreateSession(socket, next)
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

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
      timestamp: new Date().toUTCString()
    };
    socket.to(to).emit("private message", message); // send to recipient
    socket.emit("private message", message); // send to yourself
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


server.init = (cb = ()=> {}) => {
  server.httpServer.listen(cb);
}

server.close = (cb = ()=> {}) => {
  server.httpServer.close(cb);
}

// io.listen(3001);

// Export
module.exports = {server, io}


