import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './GhanaCard.css';

const GhanaCard = () => {
    const navigate = useNavigate();

    return (
        <div className="gc-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <header className="gc-header">
                    <button className="gc-back-btn" onClick={() => navigate(-1)}>
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 16L2 9L9 2" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="gc-title">Ghana Card</h1>
                    <div style={{ width: 60 }} />
                </header>
            </div>

            <div className="gc-content nice-scroll">
                <div className="gc-form-group">
                    <label className="gc-label">ID Card Number</label>
                    <div className="gc-input-wrap">
                        <input type="text" className="gc-input" defaultValue="GHA- 000000-4" readOnly />
                        <span className="gc-input-icon">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="#C4C4C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="14" height="14" rx="2" ry="2"></rect>
                                <path d="M12 2v4M6 2v4M2 10h14"></path>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="gc-form-group">
                    <label className="gc-label">Expiry Date</label>
                    <div className="gc-input-wrap">
                        <input type="text" className="gc-input" defaultValue="Aug 30, 2030" readOnly />
                        <span className="gc-input-icon">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="#C4C4C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="14" height="14" rx="2" ry="2"></rect>
                                <path d="M12 2v4M6 2v4M2 10h14"></path>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="gc-form-group">
                    <label className="gc-label">DOB</label>
                    <div className="gc-input-wrap">
                        <input type="text" className="gc-input" defaultValue="23/05/1995" readOnly />
                        <span className="gc-input-icon">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="#C4C4C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="14" height="14" rx="2" ry="2"></rect>
                                <path d="M12 2v4M6 2v4M2 10h14"></path>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="gc-form-group">
                    <label className="gc-label">Selfie</label>
                    <div className="gc-image-box">
                        <button className="gc-edit-fab">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="gc-form-group">
                    <label className="gc-label">ID Card</label>
                    <div className="gc-image-box">
                        <button className="gc-edit-fab">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <MainNavigation activeTab="profile" />
            <HomeIndicator dark />
        </div>
    );
};

export default GhanaCard;
