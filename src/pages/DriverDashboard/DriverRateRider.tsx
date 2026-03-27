import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import trackImg from '../../assets/Track.png';
import janeImg from '../../assets/lady_profile.png';
import mtnLogo from '../../assets/mtn-logo-img.png';
import './DriverRateRider.css';

const DriverRateRider = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    const handleRating = (index: number) => {
        setRating(index + 1);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="drr-screen">
            {/* Background Content - Dimmed via Backdrop */}
            <div className="drr-bg-layout">
                {/* Map */}
                <div className="drr-map-bg">
                    <img src={mapBg} alt="Map" className="drr-map-image" />
                    <div className="drr-track-car">
                        <img src={trackImg} alt="Track" className="drr-car-track-icon" />
                    </div>
                </div>

                {/* Dashboard Header Icons */}
                <div className="drr-header-mock">
                    <div className="drr-icon-circle"><div className="drr-burger-icon" /></div>
                    <div className="drr-icon-circle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </div>
                </div>

                {/* Bottom Panel behind the backdrop (Glassmorphism) */}
                <div className="drr-footer-mock">
                    <div className="drr-pm-row">
                        <span className="drr-pm-label">Payment method</span>
                        <span className="drr-pm-val">GH¢220.00</span>
                    </div>
                    <div className="drr-pm-card">
                        <img src={mtnLogo} alt="MTN" className="drr-pm-logo" />
                        <div className="drr-pm-details">
                            <span className="drr-pm-num">*** *** 1234</span>
                            <span className="drr-pm-sub">mtn mobile money</span>
                        </div>
                    </div>
                    <div className="drr-action-btns-mock">
                        <button className="drr-call-mock">Call</button>
                        <button className="drr-msg-mock">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                            <span>Message</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dark Backdrop #262626 @ 70% */}
            <div className="drr-backdrop" onClick={handleBack} />

            {/* Rating Popup (The different part) */}
            <div className="drr-popup">
                {/* Close Button */}
                <button className="drr-close-btn" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Illustration Frame (Centered) */}
                <div className="drr-illustration-frame">
                    <div className="drr-profile-bg">
                        <img src={janeImg} alt="Rider" className="drr-avatar-img" />
                    </div>
                </div>

                {/* Content */}
                <div className="drr-content">
                    <h2 className="drr-title">Ride Ended</h2>
                    
                    <div className="drr-stars-row">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <button key={i} onClick={() => handleRating(i)} className="drr-star-btn">
                                <svg width="42" height="42" viewBox="0 0 24 24" fill={i < rating ? "#FFCC00" : "none"} stroke="#FFCC00" strokeWidth="1.5">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                </svg>
                            </button>
                        ))}
                    </div>

                    <p className="drr-message">
                        Your ride has ended successfully.<br />
                        Thank you for riding with Us
                    </p>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="drr-home-indicator">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default DriverRateRider;
