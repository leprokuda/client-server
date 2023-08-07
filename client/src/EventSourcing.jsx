import React, {useEffect, useState} from "react";
import axios from "axios";

const LongPulling = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("")

  useEffect(() => {
    subscribe()
  }, [])

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:4000/connect')

    eventSource.onmessage = function (event)  {
      const message = JSON.parse(event.data)

      setMessages(prevState => [message, ...prevState])
    }
  }

  const sendMessage = async () => {
    await axios.post("http://localhost:4000/new-messages", {
      message: value,
      id: Date.now()
    })
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
              className="message"
              key={mess.id}
            >
              {mess.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LongPulling