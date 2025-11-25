import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessages } from '../../api/getMessages';
import { sendMessage } from '../../api/sendMessage';
import './styles.css';

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadMessages();
  }, [navigate]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    try {
      setSending(true);
      await sendMessage(newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="chat-container" data-easytag="id1-react/src/components/Chat/index.jsx">
      <div className="chat-header">
        <h2>Чат</h2>
      </div>
      
      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">Пока нет сообщений</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message-item">
              <div className="message-header">
                <span className="message-username">{message.username}</span>
                <span className="message-time">{formatTime(message.created_at)}</span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
        />
        <button 
          type="submit" 
          className="chat-button"
          disabled={sending || !newMessage.trim()}
        >
          {sending ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};
