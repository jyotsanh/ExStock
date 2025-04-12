import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [senderId, setSenderId] = useState('');
  const [prefers, setPrefers] = useState('english');

  // Save or generate browser ID
  useEffect(() => {
    let browserId = localStorage.getItem('browserId');
    if (!browserId) {
      browserId = uuidv4();
      localStorage.setItem('browserId', browserId);
    }
    setSenderId(browserId);

    // Fetch metadata from backend
    const fetchMetadata = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user-metadata/${browserId}`);
        setMetadata(res.data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };

    fetchMetadata();
  }, []);

  const sendMessage = async () => {
    if (!query.trim()) return;

    // Show user message
    setMessages((prev) => [...prev, { from: 'user', text: query }]);

    try {
      const payload = {
        query,
        senderId,
        prefers,
        metadata,
      };

      const res = await axios.post('http://192.168.100.88:8020/tresponse', payload);

      const botReply = res?.data?.reply || 'Chatbot responded.';
      setMessages((prev) => [...prev, { from: 'bot', text: botReply }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Failed to get response from chatbot.' },
      ]);
    }

    setQuery('');
  };

  return (
    <div style={styles.container}>
      <h2>📚 Smart Chatbot</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.from === 'user' ? '#d1e7dd' : '#f8d7da',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.controls}>
        <select
          value={prefers}
          onChange={(e) => setPrefers(e.target.value)}
          style={styles.select}
        >
          <option value="english">English</option>
          <option value="nepali">Nepali</option>
        </select>

        <input
          type="text"
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '2px solid #ccc',
    borderRadius: '12px',
    fontFamily: 'sans-serif',
  },
  chatBox: {
    height: '300px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f9f9f9',
  },
  message: {
    padding: '10px 15px',
    borderRadius: '16px',
    maxWidth: '70%',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  select: {
    padding: '5px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0d6efd',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
