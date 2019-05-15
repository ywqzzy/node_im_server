'use strict'
var http = require('http')
var io = require('socket.io')
var userCount = 0

var httpServer = http.createServer()
var server = io(httpServer)

server.on('connection', (socket) => {
  userCount ++
  console.log('client connect, current users count:', userCount)
  socket.emit('welcome', 'welcome to socket.io')
  socket.on('disconnect', () => {
    userCount --
    console.log('client disconnect, current users count:', userCount)
  })
})

httpServer.listen(8080, () => {
  console.log(`Server started.Listening to port %s`, 8080)
})
