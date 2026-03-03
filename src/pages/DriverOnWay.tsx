import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import danielAvatar from '../assets/Ellipse 1192.png';
import mtnLogo from '../assets/mtn-logo-img.png';
import mapBg from '../assets/map-bg.png';
import './Payment.css';
import './DriverOnWay.css';

const DriverOnWay = () => {
    const navigate = useNavigate();
    const [safetyModalOpen, setSafetyModalOpen] = useState(false);
    const [rideEndedOpen, setRideEndedOpen] = useState(false);
    const [modalRating, setModalRating] = useState(0);

    const toggleSafetyModal = () => setSafetyModalOpen(!safetyModalOpen);
    const toggleRideEnded = () => setRideEndedOpen(!rideEndedOpen);

    return (
        <div className="dow-screen">
            {/* ── Map Background ── */}
            <div className="dow-map-container" style={{ backgroundImage: `url(${mapBg})` }}>
                <StatusBar dark />
                {/* Header Buttons */}
                <div className="dow-map-header">
                    <button className="dow-circle-btn menu-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <button className="dow-circle-btn notify-btn" onClick={() => navigate('/notifications')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="dow-notify-dot" />
                    </button>
                </div>

                {/* Map Pins */}
                <svg className="dow-route-svg" viewBox="0 0 393 450" fill="none">
                    <path
                        d="M152 186 L152 230 C152 240, 155 250, 160 260 L168 280"
                        stroke="#64748B"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeOpacity="0.6"
                    />
                </svg>

                <div className="dow-driver-marker" style={{
                    top: '176px',
                    left: '145px',
                    width: '16px',
                    height: '32px',
                    transform: 'rotate(144.85deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="16" height="32" viewBox="0 0 16 32" fill="black">
                        <rect x="2" y="4" width="12" height="24" rx="4" />
                        <rect x="3" y="10" width="10" height="6" fill="#333" rx="1" />
                        <rect x="4" y="22" width="8" height="1" fill="#333" />
                    </svg>
                </div>

                <div className="dow-pickup-marker" style={{ top: '56%', left: '44%' }}>
                    <div className="dow-pickup-ring ring-1" />
                    <div className="dow-pickup-ring ring-2" />
                    <div className="dow-pickup-ring ring-3" />
                    <div className="dow-pickup-ring ring-4" />
                    <div className="dow-pickup-dot" />
                </div>
            </div>

            {/* ── Bottom Sheet ── */}
            <div className="dow-bottom-sheet">
                <div className="dow-drag-handle" />

                <div className="dow-status-row">
                    <p className="dow-arrival-text" onClick={toggleRideEnded} style={{ cursor: 'pointer' }}>Your driver arrives in 3:35</p>
                    <button className="dow-safety-btn" onClick={toggleSafetyModal}>Safety Centre</button>
                </div>

                <div className="dow-divider" />

                <div className="dow-driver-info-row">
                    <div className="dow-driver-main">
                        <img src={danielAvatar} alt="Daniel Asante" className="dow-avatar" />
                        <div className="dow-driver-text">
                            <h3 className="dow-driver-name">Daniel Asante</h3>
                            <div className="dow-driver-meta">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>800m (5mins away)</span>
                            </div>
                            <div className="dow-rating">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFCC00">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                </svg>
                                <span>4.9 (531 reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div className="dow-actions">
                        <button className="dow-action-btn call">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.5">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </button>
                        <button className="dow-action-btn chat" onClick={() => navigate('/chat')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0056B3">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="dow-divider" />

                <div className="dow-payment-section">
                    <div className="dow-payment-header">
                        <span className="dow-pay-label">Payment method</span>
                        <span className="dow-pay-value">GH¢220.00</span>
                    </div>
                    <div className="payment-card-premium mtn-card dow-compact-card">
                        <div className="card-glass-effect" />
                        <div className="card-top">
                            <img src={mtnLogo} alt="MTN" className="card-brand-logo-mtn" />
                            <span className="momo-label">Mobile Money</span>
                        </div>
                        <div className="card-middle">
                            <span className="premium-card-number">••• ••• ••• 1234</span>
                        </div>
                        <div className="card-bottom">
                            <div className="card-holder">
                                <span className="label">Name</span>
                                <span className="value">Jane Doe</span>
                            </div>
                            <div className="card-status">
                                <span className="active-dot" />
                                <span className="status-text">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="dow-cancel-btn" onClick={() => navigate('/rate_trip_driver')}>
                    Cancel Request
                </button>
            </div>

            <HomeIndicator dark />

            {/* ── SAFETY CENTRE MODAL ── */}
            {safetyModalOpen && (
                <div className="sc-modal-root">
                    <div className="sc-modal-backdrop" onClick={toggleSafetyModal} />
                    <div className="safety_centre">
                        <button className="sc-close-btn" onClick={toggleSafetyModal}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="sc-body">
                            <div className="sc-item">
                                <div className="sc-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="18" cy="5" r="3" />
                                        <circle cx="6" cy="12" r="3" />
                                        <circle cx="18" cy="19" r="3" />
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                    </svg>
                                </div>
                                <span className="sc-text">Share My Trip With a friend</span>
                            </div>

                            <div className="sc-divider" />

                            <div className="sc-item">
                                <div className="sc-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                        <path d="M6 21c0-3 3-5 6-5s6 2 6 5" />
                                        <path d="M17 11a5 5 0 0 0-10 0" />
                                        <circle cx="17" cy="11" r="1" fill="#CBD5E1" />
                                    </svg>
                                </div>
                                <span className="sc-text">Contact Support</span>
                            </div>

                            <div className="sc-divider" />

                            <div className="sc-item">
                                <div className="sc-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                        <path d="M6 21c0-3 3-5 6-5s6 2 6 5" />
                                        <path d="M17 11a5 5 0 0 0-10 0" />
                                        <circle cx="17" cy="11" r="1" fill="#CBD5E1" />
                                    </svg>
                                </div>
                                <span className="sc-text">Contact Emergency Services</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── RIDE ENDED MODAL ── */}
            {rideEndedOpen && (
                <div className="re-modal-root">
                    <div className="re-modal-backdrop" onClick={toggleRideEnded} />
                    <div className="ride-ended-modal">
                        <button className="re-close-btn" onClick={toggleRideEnded}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="re-content">
                            <div className="re-success-icon" />
                            <h2 className="re-title">Ride Ended</h2>

                            <div className="re-star-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className="re-star-btn"
                                        onClick={() => setModalRating(star)}
                                    >
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill={star <= modalRating ? "#FFCC00" : "none"} stroke="#FFCC00" strokeWidth="2">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            <p className="re-subtitle">
                                Your ride has ended successfully.<br />
                                Thank you for riding with Us
                            </p>

                            <button className="re-payment-btn" onClick={() => navigate('/payment')}>
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverOnWay;
