import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import visaLogo from '../../assets/visa-logo.png';
import mtnLogo from '../../assets/mtn-logo-img.png';
import './DriverPayment.css';

const DriverPayment: React.FC = () => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/add-payment-method');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="dp-screen no-scroll">
            <div className="dp-status-bar-wrapper">
                <StatusBar dark />
            </div>
            
            <header className="dp-header">
                <button className="dp-back-btn" onClick={handleBack}>
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 16L2 9L9 2" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="dp-title">Payment</h1>
                <div style={{ width: 60 }} />
            </header>

            <div className="dp-scroll-container nice-scroll">
                <div className="dp-methods-grid">
                    <div className="dp-card-premium visa-card" onClick={handleCardClick}>
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
                                <span className="value">Driver Name</span>
                            </div>
                            <div className="card-expiry-wrap">
                                <span className="label">Expires</span>
                                <span className="value">12/26</span>
                            </div>
                        </div>
                    </div>

                    <div className="dp-card-premium mtn-card" onClick={handleCardClick}>
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
                                <span className="value">Driver Name</span>
                            </div>
                            <div className="card-status">
                                <span className="active-dot"></span>
                                <span className="status-text">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dp-section-header" style={{ marginTop: '12px' }}>
                    <h2>Other Methods</h2>
                </div>

                <div className="dp-other-options">
                    <div className="dp-method-item" onClick={handleCardClick}>
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

                    <div className="dp-method-item" onClick={handleCardClick}>
                        <div className="method-icon-wrap cash">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                <circle cx="12" cy="12" r="2" />
                                <path d="M6 12h.01M18 12h.01" />
                            </svg>
                        </div>
                        <div className="method-info">
                            <span className="method-name">Cash</span>
                            <span className="method-desc">Wallet Top-up</span>
                        </div>
                        <div className="chevron-right-premium">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <button className="dp-add-method-btn" onClick={handleCardClick}>
                    Add Payment Method
                </button>
            </div>

            <footer className="dp-footer">
                <MainNavigation activeTab="home" isDriver={true} />
            </footer>
            <HomeIndicator dark />
        </div>
    );
};

export default DriverPayment;
