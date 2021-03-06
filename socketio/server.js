'use strict'

var io = require('socket.io')
var userCount = 0
var server = io()

server.on('connection', (socket) => {
  userCount ++
  console.log('client connect, current users count:', userCount)
  socket.emit('welcome', 'welcome to socket.io')
  socket.on('disconnect', () => {
    userCount --
    console.log('client disconnect, current users count:', userCount)
  })
})



server.listen(8080)

console.log(`Server started.Listening to port %s`, 8080)
