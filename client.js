'use strict'

var net = require('net')

var client = net.connect({port: 8000})

client.on('lookup', () => {
  console.log('lookup');
})

client.on('timeout', () => {
  console.log('connect to server timeout');
})

client.on('drain', () => {
  console.log('drain');
})

client.on('end', () => {
  console.log('end');
})

client.on('error', (err) => {
  console.log('error:', err);
})

client.on('close', (hasError) => {
  console.log('close:', hasError);
})

client.on('connect', () => {
  console.log('connect to server succeed');
})

client.on('data', (data) => {
  console.log('received data:', data.toString())
})
/*
setTimeout(() => {
  client.end()
}, 1000)
*/

setInterval(() => {
  client.write("hello im client")
},2000)
