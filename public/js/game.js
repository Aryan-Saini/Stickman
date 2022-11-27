const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('message', message => {
  console.log(message);
});

socket.on('redirect', message => {
  if(message === "/") {
    window.location.href = "http://localhost:3000/";
  }
});

socket.on('roomUsers', users => {
  console.log(users);
})