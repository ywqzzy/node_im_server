'use strict'

var net = require('net')

var socketList = new Set()

var server = net.createServer()

server.on('connection', (socket) => {
  socketList.add(socket)

  socket.on('data', (data) => {
    socketList.forEach( (client) => {
      //send msg to clients which is not the sender
      if(socket !== client) {
        client.write(data)
      }
    })
  })

  socket.on('close', (hasError) => {
    socketList.delete(socket)
    console.error(`client closed, current socket number is ${socketList.size}, hasErrorClose? ${hasError}`)
  })
})

server.listen(8000, () => {
  var address = server.address()
  console.log(`start server,listening port ${address.port}`)
})
