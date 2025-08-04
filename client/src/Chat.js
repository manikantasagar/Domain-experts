import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

function Chat(){
  const { state } = useLocation();
  const otherEmail = state?.email;
  const token = sessionStorage.getItem("token");
  const myEmail = sessionStorage.getItem("user-mail");

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    if (!otherEmail || !token) {
      console.log("Missing email or token:", { otherEmail, token });
      return;
    }

    console.log("Attempting WebSocket connection with:", { otherEmail, token, myEmail });
    
    // Test the WebSocket URL first
    const wsUrl = `${process.env.REACT_APP_WS_URL}ws/chat/${otherEmail}/?token=${token}`;
    console.log("WebSocket URL:", wsUrl);
    
    const ws = new WebSocket(wsUrl);
    
    // Set a timeout to detect connection issues
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        // console.error("WebSocket connection timeout - server may not be running with Daphne");
        setIsConnected(false);
      }
    }, 5000);
    
    ws.onopen = () => {
      // console.log("✅ WebSocket connected successfully");
      clearTimeout(connectionTimeout);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📨 Received message:", data);
      setMessages((prev) => [...prev, { 
        message: data.message, 
        incoming: data.sender_email !== myEmail,
        sender_email: data.sender_email,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    ws.onerror = (err) => {
      // console.error("❌ WebSocket error:", err);
      // console.error("WebSocket readyState:", ws.readyState);
      // console.error("This usually means:");
      // console.error("1. Django server is not running with Daphne");
      // console.error("2. WebSocket URL is incorrect");
      // console.error("3. Authentication failed");
      clearTimeout(connectionTimeout);
      setIsConnected(false);
    };
    
    ws.onclose = (event) => {
      // console.warn("🔌 WebSocket disconnected:", event.code, event.reason);
      // console.warn("Close codes:");
      // console.warn("1000: Normal closure");
      // console.warn("1006: Abnormal closure (server not running)");
      // console.warn("1015: TLS handshake failure");
      clearTimeout(connectionTimeout);
      setIsConnected(false);
    };

    setSocket(ws);
    
    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      clearTimeout(connectionTimeout);
      ws.close();
    };
  }, [otherEmail, token, myEmail]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) {
      console.log("Message is empty, not sending");
      return;
    }
    
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected, adding message locally only");
      // Add message locally even if WebSocket is not connected
      setMessages((prev) => [...prev, { 
        message, 
        incoming: false,
        sender_email: myEmail,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setMessage("");
      return;
    }
    
    console.log("Sending message:", message);
    socket.send(JSON.stringify({ message }));
    setMessages((prev) => [...prev, { 
      message, 
      incoming: false,
      sender_email: myEmail,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setMessage("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (!otherEmail) {
    return (
      <div className="chat-container">
        <div className="chat-header">No chat partner selected</div>
        <div className="chat-messages">
          <p>Please select a user to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chat with: <strong>{otherEmail}</strong>
        <div className={isConnected ? "chat-status-connected" : "chat-status-disconnected"}>
          {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </div>

      {!isConnected && (
        <div className="chat-warning">
          <strong>⚠️ Connection Issue:</strong><br/>
          
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message-bubble ${msg.incoming ? "chat-message-incoming" : "chat-message-outgoing"}`}
            >
              <div className="chat-message-text">{msg.message}</div>
              <div className="chat-message-time">{msg.timestamp}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-input-container">
        <input
          className="chat-input"
          placeholder={!isConnected ? "Connecting..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnter}
          disabled={false}
        />
        <button 
          onClick={handleSend} 
          className="chat-send-button"
          style={{ opacity: 1 }}
          disabled={false}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
