'use strict'

var net = require('net')

var curUserCnt = 0
var socketList = []

var server = net.createServer()

server.on("listening", () => {
  console.log('listening')
})

server.on('connection', (socket) => {
  curUserCnt += 1
  socketList.push(socket)
  socket.on('timeout', () => {
    console.log('connect to server timeout');
  })

  socket.on('drain', () => {
    console.log('drain');
  })

  socket.on('end', () => {
    console.log('客户端正常断开');
  })

  socket.on('error', (err) => {
    console.log('客户端异常连接丢失:', err);
  })

  socket.on('close', (hasError) => {
    console.log('close:', hasError);
  })

  socket.on('data', (data) => {
    console.log('received data:', data.toString())
  })
})

server.on("error", (err) => {
  console.log('error', err)
})

server.on("close", () => {
  console.log('close')
})

server.listen(8000)
console.log("listen to 8000");

setInterval(() => {
  socketList.forEach((socket) => {
    socket.write(new Date().toString())
  })
}, 3000)
