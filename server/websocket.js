const ws = require('ws')

const wss = new ws.WebSocketServer({
  port: 4000,
}, () => console.log('server started on 4000'))

wss.on('connection', function connection(ws) {
  ws.id = Date.now()

  ws.on('message', function (message) {
    message = JSON.parse(message)

    switch (message.event) {
      case 'message':
        broadcastMessage(message)
        break
      case 'connection':
        broadcastMessage(message)
        break
    }
  })
})

function broadcastMessage(message, id) {
  wss.clients.forEach(client => {
    if (client.id === id) {
      client.send(JSON.stringify(message))
    }
    client.send(JSON.stringify(message))
  })
}

const message = {
  event: 'message/connection',
  id: 123,
  date: '07.08.2023',
  username: 'leprokuda',
  message: 'Привет!'
}