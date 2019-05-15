'use strict'

var io = require('socket.io')

var server = io()

server.on('connection', (socket) => {
  socket.emit('welcome', 'welcome to socket.io')
})

server.listen(8080)

console.log(`Server started.Listening to port %s`, 8080)
