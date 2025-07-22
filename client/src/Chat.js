import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Chat = ({ roomName: propRoomName }) => {
  const params = useParams();
  const roomName = propRoomName || (params.id ? `coach_${params.id}` : 'default');
  const username = params.username ? decodeURIComponent(params.username) : 'Anonymous';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data.message]);
    };

    return () => ws.close();
  }, [roomName]);

  const sendMessage = () => {
    if (socket && input.trim() !== "") {
      socket.send(JSON.stringify({ message: input, username }));
      setInput("");
    }
  };

  return (
    <div>
      <h3>Chatting as: {username}</h3>
      <div>
        {messages.map((msg, idx) => <p key={idx}>{msg}</p>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
