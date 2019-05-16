$(function() {
  var clientHeight = document.documentElement.clientHeight
  $(".app-user-list-body").height(clientHeight - 200)
  $(".app-chat-body").height(clientHeight - 110)

  $(window).on('resize', function() {
    var clientHeight = document.documentElement.clientHeight
    $(".app-user-list-body").height(clientHeight - 200)
    $(".app-chat-body").height(clientHeight - 110)
  })


  var nickName ;
  var $appChatContent = $('.app-chat-content')
  var $elTemplate = $('#el_template')
  var client = io.connect('http://localhost:8000', {
    reconnectionAttempts: 3,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 2000,
    autoConnect: true
  })

  //utils
  function writeMsg(type, msg, title, isSelf ) {
    title = title || (type === 'system'? '系统消息': 'User')

    var template = $elTemplate.html()
      .replace('${title}', title)
      .replace('${bgClass}', type === 'system' ? 'label-danger' : 'label-info')
      .replace('${pullRight}', isSelf? 'pull-right': '')
      .replace('${time}', '00:00:00' )
      .replace('${msg}', msg)
      .replace('${info-icon}', type==='system'? 'glyphicon-info-sign': 'glyphicon-user')

    $appChatContent.append($(template))
  }

  do{
    nickName = prompt('请输入你的昵称：')
  }while(!nickName);

  client.emit('server.online', nickName)

  client.on('client.online', function(nickName) {
    writeMsg('system', '[' + nickName + ']上线了')
  })

  client.on('client.offline', function(nickName) {
      writeMsg('system', '[' + nickName + ']下线了')
  })

  client.on('error', function(err) {
    console.log(err)
  })

  client.on('connect', function() {
    console.log('connect')
  })

  client.on('disconnect', function(err) {
    console.log('disconnect:', err)
  })

  client.on('reconnect', function(count) {
    console.log('reconnect:', count)
  })

  client.on('reconnect_attempt', function(count) {
    console.log('reconnect attempt:', count)

  })

  client.on('reconnecting', function(count) {
    console.log('reconnecting:',count)
  })

  client.on('reconnect_error', function(err) {
    console.log('reconnect_error:',err)
  })

  client.on('reconnect_failed', function() {
    console.log('reconnect_failed')
  })

})

/*

var client = io.connect('http://localhost:8000', {
  reconnectionAttempts: 3,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 2000,
  autoConnect: true
})
console.log(client)

//window.prompt('please enter your nickname')

client.emit('server.online', nickName)

//client.send('hello world')  websocket  cross browser      message
client.emit('serverEvents.send', "helloworld")

client.on('client.online', function(nickName) {
  console.log( nickName + "上线了！")
})

client.on('client.offline', function(nickName) {
  console.log(nickName + "下线了！")
})

client.on('clientEvents.welcome', function(data) {
  console.log(data)
})

*/
