'use strict'

var net = require('net')

var client = net.connect({port: 8000})

client.on('data', (data) => {
  console.log(data.toString())
})
