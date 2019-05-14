'use strict'

var net = require('net')

var server = net.createServer()

server.on('connection', (socket) => {
  socket.write('Hello')
  socket.end()
})
server.listen(8000)
console.log("listen to 8000");
