import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Assume username is passed via Link state
  const username = location.state?.username || "Anonymous";
  const targetUser = location.state?.targetUser || "Other";

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (socketRef.current && input.trim() !== "") {
      socketRef.current.send(
        JSON.stringify({
          message: input,
          username,
          to: targetUser, // optional routing metadata
        })
      );
      setMessages((prev) => [...prev, { message: input, username }]);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h3>Chatting as: {username}</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", padding: "0.5rem" }}
      />
      <button onClick={sendMessage} style={{ padding: "0.5rem", marginLeft: "0.5rem" }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
