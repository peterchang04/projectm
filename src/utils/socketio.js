import io from 'socket.io-client';
let serverUrl = 'http://localhost:51337?token=testo';
let socket = io(serverUrl, { path: '/io' });

function connect() {
  socket = io(serverUrl, { path: '/io' });
}

function send(type, message) {
  if (!socket) {
    connect();
  }
  socket.send({
    type,
    message: message,
  });
}

// socket.on('asdf', (message) => {
//   console.log(message); // eslint-disable-line
// });
// console.log(socket); // eslint-disable-line

export default { send };
