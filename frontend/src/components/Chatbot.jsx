import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "./AddDishForm";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    "Greetings,\n Have a great Day. How Can I Help You?",
  ]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send the message to the backend
      const response = await axios.post(`${backend_url}/chatbot`, { message });
      const chatbotResponse = response.data.message;
      setLoading(false);
      // Update the messages state with the user message and chatbot response
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
        chatbotResponse,
      ]);

      // Reset message input
      setMessage("");
    } catch (error) {
      // Handle error if the request fails
      console.error(error);
    }
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-heading">Chatbot</h2>
      <div className="chat-messages"  style={{position:'relative'}}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p
              style={{
                background: index % 2 === 0 || index === 0 ? "pink" : "white",
                textAlign:  index % 2 === 0 || index === 0 ? "left" : "right"
              }}
            >
              {msg}
             
            </p>
          
          </div>
        ))}
         {loading && <p  id='loading-text'  > Loading...</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Ask Location, Work hours and more..."
          required
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
