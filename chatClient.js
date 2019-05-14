'use strict'

 var net = require('net')

 var client = net.connect({port: 8000})

 client.on('connect', () => {
   console.log('connect success, ready to chat')
 })

 client.on('data', (data) => {
   var jsonData = JSON.parse(data.toString())
   console.log(jsonData)
 })

 var data = JSON.stringify({nickName: 'zzywq', message:'love zzy'})

 client.write(data)
