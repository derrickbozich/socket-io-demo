let roomNumber = 10001;
const rooms = {};
let roomId = '';

const io = require('socket.io')({
  cors: {
    origin: ['http://localhost:3000']
  }
});

io.on('connection', socket => {
  console.log(`connect yo: ${socket.id}`);
  io.to(socket.id).emit('set userId', socket.id);

  socket.on('hello!', () => {
    console.log(`hello from ${socket.id}`);
  });

  socket.on('set userId', ({input}) => {
    console.log(`set user id: hello from ${input}`);
    io.to(socket.id).emit('set userId', input);
  });

  socket.on('disconnect', () => {
    console.log(`disconnect: ${socket.id}`);
  });
  // triggered by 'enter room' event on front end
  socket.on('set roomId & join', ({ userId, customRoomId }) => {
    // if custom room is provided && spots are available, assign to private room or add new private room; if none is provided assign to default room
    roomId = customRoomId ? customRoomId : 'room' + roomNumber;

    socket.join(roomId);

    const numOfParticipants = Array.from(
      socket.adapter.rooms.get(roomId)
    ).length;

    if (!customRoomId && numOfParticipants >= 3) {
      roomNumber++;
    }

    // initialize a room in state object or add to existing room
    if (!rooms[roomId]) rooms[roomId] = { [userId]: '' };
    else
      rooms[roomId] = {
        ...rooms[roomId],
        [userId]: '',
      };


    // echo room ID back to users upon connection
    io.in(roomId).emit('set roomId', roomId);

    // echo user ID back to user upon connection
    const users = rooms[roomId];

    io.in(roomId).emit('state from server', users);
  });

  socket.on('set color', ({ roomId, user }) => {
    rooms[roomId] = {
      ...rooms[roomId],
      ...user,
    };

    const users = rooms[roomId];
    io.in(roomId).emit('state from server', users);
  });

  socket.on('transmit mouse', (room, data) => {
    io.in(room).emit('mouse response', data);
  });

  socket.on('begin', (room) => {
    roomNumber++;
    io.in(room).emit('close modal');
  });

  socket.on('clear all', room => {
    io.in(room).emit('clear all server');
  });

  socket.on('client chat', ({ input, color }, socketRoom) => {
    io.in(socketRoom).emit('server chat', { input, color });
  });

  socket.on('add object', (socketRoom, data) => {
    io.in(socketRoom).emit('emit add object', data);
  });

  socket.on('undo', (socketRoom) => {
    io.in(socketRoom).emit('undo last');
  });
});

io.listen(3001);

setInterval(() => {
  io.emit('message', new Date().toISOString());
}, 1000);
