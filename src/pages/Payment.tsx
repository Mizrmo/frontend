import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import visaLogo from '../assets/visa-logo-img.png';
import mtnLogo from '../assets/mtn-logo-img.png';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/add-payment-method');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="payment-screen no-scroll">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <header className="payment-header">
                <button className="back-btn-circle" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="payment-title-main">Payment</h1>
                <div className="header-action-placeholder"></div>
            </header>

            <div className="payment-scroll-container">
                <div className="section-header">
                    <h2>Saved Methods</h2>
                    <button className="add-new-btn" onClick={handleCardClick}>Add New</button>
                </div>

                <div className="payment-methods-grid">
                    <div className="payment-card-premium visa-card" onClick={handleCardClick}>
                        <div className="card-glass-effect"></div>
                        <div className="card-top">
                            <img src={visaLogo} alt="Visa" className="card-brand-logo" />
                            <div className="card-chip"></div>
                        </div>
                        <div className="card-middle">
                            <span className="premium-card-number">•••• •••• •••• 8970</span>
                        </div>
                        <div className="card-bottom">
                            <div className="card-holder">
                                <span className="label">Card Holder</span>
                                <span className="value">Jane Doe</span>
                            </div>
                            <div className="card-expiry-wrap">
                                <span className="label">Expires</span>
                                <span className="value">12/26</span>
                            </div>
                        </div>
                    </div>

                    <div className="payment-card-premium mtn-card" onClick={handleCardClick}>
                        <div className="card-glass-effect"></div>
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
                                <span className="active-dot"></span>
                                <span className="status-text">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-header" style={{ marginTop: '24px' }}>
                    <h2>Other Methods</h2>
                </div>

                <div className="other-payment-options">
                    <div className="method-item" onClick={handleCardClick}>
                        <div className="method-icon-wrap bank">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10l10 7 10-7-10-7z" />
                            </svg>
                        </div>
                        <div className="method-info">
                            <span className="method-name">Bank Transfer</span>
                            <span className="method-desc">Direct from your account</span>
                        </div>
                        <div className="chevron-right-premium">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>

                    <div className="method-item" onClick={handleCardClick}>
                        <div className="method-icon-wrap cash">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                <circle cx="12" cy="12" r="2" />
                                <path d="M6 12h.01M18 12h.01" />
                            </svg>
                        </div>
                        <div className="method-info">
                            <span className="method-name">Cash</span>
                            <span className="method-desc">Pay when you arrive</span>
                        </div>
                        <div className="chevron-right-premium">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default Payment;
