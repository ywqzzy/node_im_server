 'use strict'

 var net = require('net')
 var repl = require('repl')

 var client = net.connect({port: 8000})

var nickName
var client
var globalCallback

var connectServer = () => {

  client.on('connect', () => {
    console.log('connect success, ready to chat')
  })


  client.on('data', (data) => {
    var jsonData = JSON.parse(data.toString())
    //console.log(jsonData)
    globalCallback && globalCallback(null, `${jsonData.nickName}: ${jsonData.message}`)
  })
  client.on('close', (hasError) => {
    console.log(`client closed,has error: ${hasError}`)
    process.exit()
  })

  return client
}

//var data = JSON.stringify({nickName: 'zzywq', message:'love zzy'})

//client.write(data)

console.log('welcome to mychat.Just enjoy it')
console.log('please enter your nickname.')
var replInstance = repl.start({
  eval: (cmd, context, filename, callback) => {
    cmd = cmd.replace('\n', '')
    if(!nickName) {
      nickName = cmd
      console.log("start connecting to server")
      client = connectServer()
      console.log('connect success, ready to chat')
      //callback(null, cmd)
      globalCallback = callback
      globalCallback(null,cmd)
      return
    }
    if(cmd === 'exit') {
      client.end()
      //process.exit()
      return
    }
    var data = JSON.stringify({nickName:nickName, message:cmd})
    client.write(data)
    globalCallback(null, `${nickName}: ${cmd}`)
  }
})
