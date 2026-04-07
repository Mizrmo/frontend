import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import danielAvatar from '../../assets/Ellipse 1192.png';
import './BookedRideDetails.css';

const BookedRideDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="brd-screen">
            <div className="brd-status-bar-wrapper">
                <StatusBar dark />
            </div>

            {/* Back row */}
            <div className="nav-actions-row">
                <button className="back-text-btn" onClick={() => navigate(-1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>

            {/* ── Header ── */}
            <div className="brd-header">
                <div className="brd-header-left">
                    <h1 className="brd-title">Ride Details</h1>
                    <p className="brd-subtitle">17 Oct, 24 | GH¢22.00</p>
                </div>
                <button
                    className="brd-refresh-btn"
                    onClick={() => navigate('/confirm_ride')}
                    aria-label="Refresh ride"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#0056B3" fillOpacity="0.1" />
                        <path d="M12 8v4l3 3" stroke="#0056B3" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20.5 12a8.5 8.5 0 1 1-1.5-4.5" stroke="#0056B3" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="brd-scroll-content">
                {/* ── Ride Information ── */}
                <section className="brd-section">
                    <h2 className="brd-section-label">Ride Information</h2>
                    <div className="brd-location-block">
                        <div className="brd-loc-row">
                            <span className="brd-dot blue">
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0056B3' }} />
                            </span>
                            <div className="brd-loc-info">
                                <span className="brd-loc-title">Current location</span>
                                <span className="brd-loc-sub">Ashaiman, main station</span>
                            </div>
                        </div>
                        <div className="brd-loc-row">
                            <span className="brd-dot yellow">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                </svg>
                            </span>
                            <div className="brd-loc-info">
                                <span className="brd-loc-title">Drop off Location</span>
                                <span className="brd-loc-sub">Community One</span>
                            </div>
                            <span className="brd-dist">2.2km</span>
                        </div>
                    </div>
                </section>

                {/* ── Driver Details ── */}
                <section className="brd-section">
                    <h2 className="brd-section-label">Driver Details</h2>
                    <div className="brd-driver-card">
                        <div className="brd-driver-main">
                            <img src={danielAvatar} alt="Daniel Asante" className="brd-avatar" />
                            <div className="brd-driver-info">
                                <span className="brd-driver-name">Daniel Asante</span>
                                <span className="brd-driver-meta">45 rides completed •</span>
                                <div className="brd-rating-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#E2E8F0">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                    </svg>
                                    <span>4.8/5.0</span>
                                </div>
                                <div className="brd-car-row">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="2">
                                        <path d="M18.5 13H5.5a2.5 2.5 0 0 0-2.5 2.5V17c0 .55.45 1 1 1h17a1 1 0 0 0 1-1v-1.5a2.5 2.5 0 0 0-2.5-2.5z" />
                                        <path d="M7 13V9.5a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5V13" />
                                    </svg>
                                    <span>GT - 3467 - 25</span>
                                </div>
                            </div>
                        </div>
                        <div className="brd-driver-actions">
                            <button className="brd-action-btn call">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.5">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </button>
                            <button className="brd-action-btn chat" onClick={() => navigate('/chat')}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0056B3">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Payment Details ── */}
                <section className="brd-section">
                    <h2 className="brd-section-label">Payment Details</h2>
                    <div className="brd-payment-row">
                        <span className="brd-pay-label">Total trip Cost</span>
                        <span className="brd-pay-value">GH¢22.00</span>
                    </div>
                </section>
            </div>

            {/* ── Bottom Nav Bar ── */}
            <nav className="ut-tab-bar">
                <button className="ut-nav-btn" onClick={() => navigate('/home_screen_Transport')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.5s-8-5.5-8-11.5c0-4.42 3.58-8 8-8s8 3.58 8 8c0 6-8 11.5-8 11.5z" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="5" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="2" fill="black" />
                        </svg>
                    </div>
                    <span>Home</span>
                </button>
                <button className="ut-nav-btn active" onClick={() => navigate('/upcoming-trips')}>
                    <div className="tab-icon-wrap" style={{ width: '28px', height: '28px' }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="4" fill="#0056B3" />
                            <path d="M4 8h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M20 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="10" cy="16" r="4.5" fill="white" />
                        </svg>
                    </div>
                    <span style={{ color: '#0056B3', fontWeight: '600' }}>Trips</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/favorite-rides')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            <path d="M17.5 7.5a1.5 1.5 0 0 1 1.5 1.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span>Favorites</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/account-settings')}>
                    <div className="tab-icon-wrap" style={{ width: '25px', height: '25px' }}>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <span>Profile</span>
                </button>
            </nav>


            <HomeIndicator dark />
        </div>
    );
};

export default BookedRideDetails;
