import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import janeImg from '../../assets/lady_profile.png';
import chatIcon from '../../assets/Chat.png';
import callIcon from '../../assets/call.png';
import './DriverRideDetails.css';

const DriverRideDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="drd-screen">
            {/* Header */}
            <div className="drd-header">
                <StatusBar dark />
                <div className="drd-header-nav">
                    <button className="drd-back-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="drd-page-title">Ride History</h1>
                    <div className="drd-spacer" />
                </div>
            </div>

            <div className="drd-content-scroll">
                {/* Title and Chat Action */}
                <div className="drd-hero-row">
                    <div className="drd-title-group">
                        <h2 className="drd-main-title">Ride Details</h2>
                        <p className="drd-subtitle">17 Oct, 24 | GH¢22.00</p>
                    </div>
                    <button className="drd-chat-bubble-btn" onClick={() => navigate('/chat')}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                    </button>
                </div>

                {/* Ride Information Section */}
                <div className="drd-section">
                    <h3 className="drd-section-label">Ride Information</h3>
                    <div className="drd-route-display">
                        <div className="drd-route-icons">
                            <div className="drd-icon-circle-blue" />
                            <div className="drd-route-line-dotted" />
                            <div className="dsr-loc-marker-wrap">
                            <div className="dsr-pin-halo">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="dsr-pin-yellow">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#FFCC00" />
                                </svg>
                            </div>
                        </div>
                        </div>
                        <div className="drd-route-details">
                            <div className="drd-stop">
                                <h4 className="drd-stop-label">Current location</h4>
                                <p className="drd-stop-address">Ashaiman, main station</p>
                            </div>
                            <div className="drd-stop last">
                                <div className="drd-stop-row">
                                    <h4 className="drd-stop-label">Drop off Location</h4>
                                    <span className="drd-dist-val">2.2km</span>
                                </div>
                                <p className="drd-stop-address">Community One</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rider Details Section */}
                <div className="drd-section">
                    <h3 className="drd-section-label">Rider Details</h3>
                    {[1, 2].map((id) => (
                        <div className="drd-rider-row" key={id}>
                            <div className="drd-rider-profile">
                                <div className="drd-avatar-wrap">
                                    <img src={janeImg} alt="Rider" />
                                </div>
                                <span className="drd-rider-name">Jane Asantewa</span>
                            </div>
                            <button className="drd-call-pill-btn">
                                <img src={callIcon} alt="Call" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Payment Details Section */}
                <div className="drd-section">
                    <h3 className="drd-section-label">Payment Details</h3>
                    <div className="drd-payment-row">
                        <span className="drd-pay-label">Total trip Cost</span>
                        <span className="drd-pay-val">GH¢22.00</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="drd-action-container">
                    <button className="drd-start-btn" onClick={() => navigate('/driver_start_ride')}>
                        Start Ride
                    </button>
                </div>
            </div>

            {/* Bottom Nav & Indicator */}
            <MainNavigation activeTab="home" isDriver={true} />
            <div className="drd-home-indicator-fix">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default DriverRideDetails;
