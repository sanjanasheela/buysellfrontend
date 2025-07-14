import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);

    const inputToSend = userInput;
    setUserInput("");

    try {
      const res = await fetch("http://localhost:8080/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: inputToSend })
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error getting reply" }]);
    }
  };

  return (
    <div style={{
      width: 300,
      height: 400,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: 10,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <h3 style={{ marginBottom: 5 }}>Chatbot</h3>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: 5 }}>
            <p style={{ margin: 0 }}>
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
            </p>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ width: "70%", padding: "5px" }}
        />
        <button onClick={sendMessage} style={{ width: "28%", padding: "5px", marginLeft: "2%" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
