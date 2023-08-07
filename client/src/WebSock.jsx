import React, {useRef, useState} from "react";

const WebSock = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("")
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState("")

  const socket = useRef()

  function connect() {
    socket.current = new WebSocket("ws://localhost:4000")

    socket.current.onopen = () => {
      setConnected(true)

      const message = {
        event: "connection",
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))

      console.log("Подключение установлено")
    }

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)

      setMessages(prevState => [message, ...prevState])
    }

    socket.current.onclose = () => {
      console.log("Socket закрыт")
    }

    socket.current.onerror = () => {
      console.log("Произошла ошибка")
    }
  }


  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message'
    }

    socket.current.send(JSON.stringify(message))
    setValue('')
  }

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            placeholder="Введите ваше имя"
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
          />
          <button onClick={connect}>Войти</button>
        </div>
      </div>
    )
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>

        <div className="messages">
          {messages.map(mess =>
            <div
              key={mess.id}
            >
              {mess.event === "connection"
                ? <div className="connection_message">Пользователь {mess.username} подключился</div>
                : <div className="message">{mess.username}. {mess.message}</div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WebSock