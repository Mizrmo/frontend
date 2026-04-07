import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import calendarIcon from '../../assets/calendar.png';
import './DriverGhanaCard.css';

const DriverGhanaCard = () => {
    const navigate = useNavigate();

    return (
        <div className="dgc-screen">
            <StatusBar dark />
            
            <header className="dgc-header">
                <button className="dgc-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="dgc-title">Ghana Card</h1>
            </header>

            <div className="dgc-content">
                {/* ID Card Number */}
                <div className="dgc-form-group">
                    <label className="dgc-label">ID Card Number</label>
                    <div className="dgc-input-wrap">
                        <input type="text" className="dgc-input" defaultValue="GHA- 000000-4" readOnly />
                    </div>
                </div>

                {/* Expiry Date */}
                <div className="dgc-form-group">
                    <label className="dgc-label">Expiry Date</label>
                    <div className="dgc-input-wrap">
                        <input type="text" className="dgc-input" defaultValue="Aug 30, 2030" readOnly />
                        <div className="dgc-input-icon">
                            <img src={calendarIcon} alt="calendar" style={{ width: '24px', height: '24px' }} />
                        </div>
                    </div>
                </div>

                <div className="dgc-form-group">
                    <label className="dgc-label">DOB</label>
                    <div className="dgc-input-wrap">
                        <input type="text" className="dgc-input" defaultValue="23/05/1995" readOnly />
                        <div className="dgc-input-icon">
                            <img src={calendarIcon} alt="calendar" style={{ width: '24px', height: '24px' }} />
                        </div>
                    </div>
                </div>

                {/* Selfie */}
                <div className="dgc-form-group">
                    <label className="dgc-label">Photo</label>
                    <div className="dgc-image-box">
                        <button className="dgc-edit-fab">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ID Card */}
                <div className="dgc-form-group">
                    <label className="dgc-label">ID Card</label>
                    <div className="dgc-image-box">
                        <button className="dgc-edit-fab">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="dgc-footer">
                <button className="dgc-save-btn" onClick={() => navigate(-1)}>
                    Save Changes
                </button>
                <MainNavigation activeTab="profile" isDriver={true} />
            </div>

        </div>
    );
};

export default DriverGhanaCard;
