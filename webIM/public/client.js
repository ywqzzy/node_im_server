var client = io.connect('http://localhost:8000', {
  reconnectionAttempts: 3,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 2000,
  autoConnect: true
})
console.log(client)

//client.send('hello world')  websocket  cross browser      message
client.emit('serverEvents.send', "helloworld")

client.on('clientEvents.welcome', (data) => {
  console.log(data)
})

client.on('error', function(err) {
  console.log(err)
})

client.on('welcome', function(data) {
  console.log(data)
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
