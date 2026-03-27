import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './HelpSupport.css';

const HelpSupport = () => {
    const navigate = useNavigate();

    return (
        <div className="hs-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <header className="hs-header">
                    <button className="hs-back-btn" onClick={() => navigate(-1)}>
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 16L2 9L9 2" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="hs-title">Help & Support</h1>
                    <div style={{ width: 60 }} />
                </header>
            </div>

            <div className="hs-content nice-scroll">
                <div className="hs-chat-card">
                    <h2 className="hs-chat-title">Start Another Conversation</h2>
                    <div className="hs-avatar-group">
                        <div className="hs-avatar"></div>
                        <div className="hs-avatar"></div>
                        <div className="hs-avatar"></div>
                    </div>
                    <div className="hs-message-pill">
                        <span className="hs-message-text">Send Us A message</span>
                        <div className="hs-message-circle"></div>
                    </div>
                </div>

                <div className="hs-help-section">
                    <h3 className="hs-help-title">Tell us how we can help</h3>
                    <div className="hs-search-bar">
                        <svg className="hs-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="search for help" className="hs-search-input" />
                    </div>

                    <div className="hs-faq-list">
                        <div className="hs-faq-item">
                            <span>Find Some FAQs for this side</span>
                        </div>
                        <div className="hs-faq-item">
                            <span>Find Some FAQs for this side</span>
                        </div>
                        <div className="hs-faq-item">
                            <span>Find Some FAQs for this side</span>
                        </div>
                    </div>
                </div>
            </div>

            <MainNavigation activeTab="profile" />
            <HomeIndicator dark />
        </div>
    );
};

export default HelpSupport;
