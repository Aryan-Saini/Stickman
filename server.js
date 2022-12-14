const path = require("path");
const http = require('http');
const express = require("express");
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//? Set static Folder
app.use(express.static(path.join(__dirname, 'public')));

//? Run when client connect
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    const roomSize = getRoomUsers(user.room).length;
    if (roomSize <= 2) {
      socket.join(user.room);
      socket.emit('message', 'Welcome to StickGame');
      socket.broadcast.to(user?.room).emit('message', `A ${username} has joined the chat`);

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    } else {
      socket.emit('redirect', '/');
    }

  });

  //! listen to movement in specif room
  socket.on("PlayerUpdate", ({ mainPlayer, room }) => {
    console.log(mainPlayer);
    socket.broadcast.to(room).emit("EnemyMovement", mainPlayer);
  })
  socket.on("PlayerAttack", ({ mainPlayer, room }) => {
    console.log(mainPlayer);
    socket.broadcast.to(room).emit("EnemyMovement", mainPlayer);
  })


  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', `A ${user.username} jas left the chat`)
    }

  });

});

const PORT = 80 || process.e8nv.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));