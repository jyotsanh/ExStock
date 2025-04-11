import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://192.168.100.88:8016');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    socketRef.current.onmessage = (event) => {
      console.log('Received:', event.data);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: event.data }]);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const newMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // ✅ Check if WebSocket is OPEN before sending
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(input);
      } else {
        console.error('WebSocket is not open. ReadyState:', socketRef.current?.readyState);
      }

      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-[#1e293b] text-white p-3 flex justify-between items-center">
            <span>ChatBot</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl">×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-200 self-start mr-auto'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
