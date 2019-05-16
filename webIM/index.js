'use strict'
var http = require('http')
var path = require('path')
var express = require('express')
//console.log('abcddddedsadkhashkadsjdkdsjkasasdasdsadsadhk');
var SocketIo = require('socket.io')
var app = express()

app.use(express.static(path.join(__dirname, './public')))

var server = http.Server(app)
var io = new SocketIo(server, {
  pingTimeout: 1000 * 10, // default one minute
  pingInterval: 1000 * 2, //default 2.5s ping once
  transports: ['websocket', 'polling'],
  allowUpgrades: true, //default true
  httpCompression: true,  // is encrypted
  path: '/socket.io',
  serverClient: false, //禁用客户端js
})

//auth
io.set('authorization', (handShakeData, accept) => {
  if(handShakeData.headers.cookie) {
    handShakeData.headers.userId = Date.now()
    accept(null, true)
  }else {
    accept('authorization Error', false)
  }
})

var userMap = new Map()

io.on('connection', (socket) => {
  //console.log(socket.handshake.headers.userId)
  //socket.emit('welcome', 'welcome')
  socket.on('serverEvents.send', (data) => {
    console.log(data)
  })// on

  socket.on('server.online', (nickName) => {
    socket.nickName = nickName
    io.emit('client.online', nickName)
    console.log("fuck!",nickName)
  })

  socket.on('server.newMsg', (msgObj) => {
    msgObj.now = Date.now()
    msgObj.nickName = socket.nickName
    io.emit('client.newMsg', msgObj)
  })


  socket.on('disconnect', () => {
    socket.broadcast.emit('client.offline', socket.nickName)
  })

  userMap.set(socket.id, socket)
  //socket.emit('clientEvents.welcome', 'welcome to myIM') //emit  you can define events
  //io.emit("online", socket.id)
  // io.sockets.emit
  // socket.broadcast.emit  广播给除自己之外的人
  for(let client of userMap.values()) {
    if(client.id != socket.id) {
      client.emit('online', 'welcome')
    }
  }
})

server.listen('8000', (err) => {
  if(err) return console.error(err);
  console.log('server started .listening port %s', server.address().port)
})
