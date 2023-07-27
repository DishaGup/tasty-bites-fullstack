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
    <section class="section section-divider white blog" >
  
    <div className="chatbot-container container">
       <svg
    width="50px"
    height="50px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"

  >
    <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z" />
    <ellipse cx={8.5} cy={12} rx={1.5} ry={2} />
    <ellipse cx={15.5} cy={12} rx={1.5} ry={2} />
    <path d="M8 16h8v2H8z" />
  </svg>  
  <h2 class="h2 section-title">
  TastyBites <span class="span">Bot</span>
          </h2>

          <p class="section-text">
          Utilizing Gen AI 
          </p>
      <div className="chat-messages"  style={{position:'relative'}}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p
              style={{
                backgroundColor: index % 2 === 0 || index === 0 ? "hsl(32, 100%, 59%)" : "white",
                textAlign:  index % 2 === 0 || index === 0 ? "left" : "right"
                ,color:  index % 2 === 0 || index === 0 ? "white" : ""
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
          className="input-field"
        />
        <button type="submit" style={{margin:'50px'}} className="btn btn-hover">
          Send
        </button>
      </form>
    </div> </section>
  );
};

export default Chatbot;
