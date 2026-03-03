import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import danielAvatar from '../assets/Ellipse 1192.png';
import './BookedRideDetails.css';

const BookedRideDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="brd-screen">
            <StatusBar dark />

            {/* ── Header ── */}
            <header className="brd-header">
                <div className="brd-header-left">
                    <button className="brd-back-btn" onClick={() => navigate(-1)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="brd-title">Ride Details</h1>
                    <p className="brd-subtitle">17 Oct, 24  |  GH¢22.00</p>
                </div>
                <div className="brd-header-right">
                    <div className="brd-car-status-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#0056B3" strokeWidth="2" fill="#EFF6FF" />
                            <path d="M8 12C8 12 9.5 10 12 10C14.5 10 16 12 16 12C16 12 14.5 14 12 14C9.5 14 8 12 8 12Z" stroke="#0056B3" strokeWidth="2" />
                            <circle cx="12" cy="12" r="2" fill="#0056B3" />
                        </svg>
                    </div>
                </div>
            </header>

            <div className="brd-scroll-content">
                {/* ── Ride Information ── */}
                <section className="brd-section">
                    <h2 className="brd-section-label">Ride Information</h2>
                    <div className="brd-location-block">
                        <div className="brd-loc-row">
                            <span className="brd-dot blue" />
                            <div className="brd-loc-info">
                                <span className="brd-loc-title">Current location</span>
                                <span className="brd-loc-sub">Ashaiman, main station</span>
                            </div>
                        </div>
                        <div className="brd-loc-row">
                            <span className="brd-dot yellow" />
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
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFCC00">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                    </svg>
                                    <span>4.8/5.0</span>
                                </div>
                                <div className="brd-car-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                                        <rect x="2" y="7" width="20" height="12" rx="2" />
                                        <path d="M7 7V5h10v2" />
                                    </svg>
                                    <span>GT - 3467 - 25</span>
                                </div>
                            </div>
                        </div>
                        <div className="brd-driver-actions">
                            <button className="brd-action-btn call">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.5">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </button>
                            <button className="brd-action-btn chat">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0056B3">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" stroke="#94A3B8" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M9 21V12h6v9" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Home</span>
                </button>
                <button className="ut-nav-btn active">
                    <div className="ut-nav-icon-bg">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="2" width="13" height="17" rx="2" stroke="#fff" strokeWidth="1.8" />
                            <path d="M4 4H2v17a2 2 0 0 0 2 2h14v-2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="14" cy="14" r="4" stroke="#fff" strokeWidth="1.8" />
                        </svg>
                    </div>
                    <span>Trips</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/favorite-rides')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#94A3B8" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    <span>Favorites</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/profile-setup')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="1.8" />
                    </svg>
                    <span>Profile</span>
                </button>
            </nav>

            <HomeIndicator dark />
        </div>
    );
};

export default BookedRideDetails;
