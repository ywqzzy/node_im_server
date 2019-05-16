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
  var $elBtnSend = $('#el_btn_send')
  var $inputMsg = $('#el_input_msg')
  var $elUserList = $('#table_userlist')
  var $elBtnSendFile = $('#el_btn_sendfile')

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
      .replace(/\${pullRight}/g, isSelf? 'pull-right': '')
      .replace('${time}', '00:00:00' )
      .replace('${msg}', msg)
      .replace('${textRight}', isSelf? 'text-right': '')
      .replace('${info-icon}', type==='system'? 'glyphicon-info-sign': 'glyphicon-user')

    $appChatContent.append($(template))
  }

  function sendMsg(msg, type) {
    var msgObj = {
      type: type || 'text',
      data: msg,
      clientId: client.id
    }

    client.emit('server.newMsg', msgObj)
  }

  $elBtnSend.on('click', function() {
    var value = $inputMsg.val()
    if(value) {
      sendMsg(value)
    }
    $inputMsg.val('')
  })

  $elBtnSendFile.on('click', function() {

  })

  $(document).on('paste', function(e) {
    var originalEvent = e.originalEvent
    var items

    if(originalEvent.clipboardData && originalEvent.clipboardData.items) {
      items = originalEvent.clipboardData.items
    }
    if(items) {
      for(var i = 0; i < items.length; i++) {
        var item = items[i]
        if(item.kind === 'file') {
          var pasteFile = item.getAsFile()
          if(pasteFile.size > 1024 * 1024) {
            return
          }
          var reader = new FileReader()
          reader.onloadend = function() {
              var imgBase64Str = reader.result
              console.log(imgBase64Str)
              sendMsg(imgBase64Str, 'image')
          }
          reader.readAsDataURL(pasteFile)
        }
      }
    }
  })

  do{
    nickName = prompt('请输入你的昵称：')
  }while(!nickName);

  $('#span_nickName').text(nickName)

  client.emit('server.online', nickName)

  client.on('client.newMsg', function(msgObj) {
    if(msgObj.type === 'image') {
      msgObj.data = '<img src="'+ msgObj.data + '" alt="image" >'

    }
    writeMsg('user', msgObj.data, msgObj.nickName, msgObj.clientId === client.id)
    $appChatContent[0].scrollTop = $appChatContent[0].scrollHeight

  })

  client.on('client.online', function(nickName) {
    writeMsg('system', '[' + nickName + ']上线了')
  })

  client.on('client.offline', function(nickName) {
      writeMsg('system', '[' + nickName + ']下线了')
  })

  client.on('client.onlineList', function(userList) {
    console.log(userList)
    $elUserList.find('tr').not(':eq(0)').remove()
    userList.forEach(function(userNick) {
      let t =  $(`<tr><td> ${userNick} </td></tr>`)
      $elUserList.append(t)
    })
  })

  var intervalId = setInterval(function() {
    client.emit('server.getOnlineList')
  }, 1000 * 10)



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
