import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import danielAvatar from '../assets/Ellipse 1192.png';
import './Chat.css';

const Chat = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const messages = [
        { id: 1, text: "Good Evening!", time: "8:29 pm", sender: "driver", avatar: danielAvatar },
        { id: 2, text: "Welcome to mizrmo Customer Service", time: "8:29 pm", sender: "driver", avatar: danielAvatar },
        { id: 3, text: "Welcome to mizrmo Customer Service", time: "8:29 pm", sender: "user" },
        { id: 4, text: "Welcome to mizrmo Customer Service", time: "8:29 pm", sender: "driver", avatar: danielAvatar },
        { id: 5, text: "Welcome to mizrmo Customer Service", time: "Just now", sender: "user" }
    ];

    return (
        <div className="chat-screen">
            <StatusBar dark />

            {/* Header */}
            <header className="chat-header">
                <button className="chat-back-btn" onClick={() => navigate(-1)}>
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="chat-title">Chat</h1>
                <div className="header-spacer" />
            </header>

            {/* Chat Body */}
            <div className="chat-body">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                        {msg.sender === 'driver' && (
                            <img src={msg.avatar} alt="Driver" className="chat-avatar" />
                        )}
                        <div className="chat-bubble-container">
                            <div className="chat-bubble">
                                {msg.text}
                            </div>
                            <span className="chat-timestamp">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Footer */}
            <footer className="chat-footer">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="chat-input"
                    />
                    <div className="chat-input-actions">
                        <button className="chat-icon-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                                <circle cx="16.5" cy="9.5" r="1.5" fill="#94A3B8" />
                            </svg>
                        </button>
                        <button className="chat-icon-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </footer>

            <button className="chat-send-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
                </svg>
            </button>

            <HomeIndicator dark />
        </div>
    );
};

export default Chat;
