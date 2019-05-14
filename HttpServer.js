'use strict'

var http = require('http')

var httpServer = http.createServer((req, res) => {
  res.write('hello from http')
  res.end()
})

httpServer.listen(8081)
console.log("http server listen 8081")
