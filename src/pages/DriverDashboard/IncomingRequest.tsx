import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import trackImg from '../../assets/Track.png';
import carImg from '../../assets/cars/ToyotaVitz.png';
import mtnLogo from '../../assets/mtn-logo-img.png';
import './IncomingRequest.css';

const IncomingRequest = () => {
    const navigate = useNavigate();

    return (
        <div className="ir-screen">
            {/* Background Content - Blurred */}
            <div className="ir-bg-blur">
                {/* Map */}
                <div className="ir-map-bg">
                    <img src={mapBg} alt="Map" className="ir-map-image" />
                    <div className="dsr-track-car">
                        <img src={trackImg} alt="Track" className="dsr-car-track-icon" />
                    </div>
                </div>

                {/* Dashboard Header Icons */}
                <div className="ir-header-mock">
                    <div className="ir-icon-circle"><div className="ir-burger-icon" /></div>
                    <div className="ir-icon-circle"><div className="ir-bell-icon" /></div>
                </div>

                {/* Mock Content behind popup (Payment/Cancel) */}
                <div className="ir-bg-content">
                    <div className="ir-payment-mock">
                        <div className="ir-pm-row">
                            <span className="ir-pm-label">Payment method</span>
                            <span className="ir-pm-val">GH¢220.00</span>
                        </div>
                        <div className="ir-pm-card">
                            <img src={mtnLogo} alt="MTN" className="ir-pm-logo" />
                            <div className="ir-pm-details">
                                <span className="ir-pm-num">*** *** 1234</span>
                                <span className="ir-pm-sub">mtn mobile money</span>
                            </div>
                        </div>
                    </div>
                    <button className="ir-cancel-mock-btn">Cancel Request</button>
                </div>
            </div>

            {/* Dark Backdrop #262626 @ 70% */}
            <div className="ir-backdrop" onClick={() => navigate('/driver-home')} />

            {/* Status Bar */}
            <div className="ir-status-bar">
                <StatusBar dark />
            </div>

            {/* Popup Modal */}
            <div className="ir-popup">
                {/* Close Button */}
                <button className="ir-close-btn" onClick={() => navigate('/driver-home')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Illustration Circle */}
                <div className="ir-illustration-frame">
                    <div className="ir-circle-bg">
                        <img src={carImg} alt="Car" className="ir-car-icon" />
                    </div>
                </div>

                {/* Content */}
                <div className="ir-content">
                    <h2 className="ir-title">Ride Request</h2>
                    <p className="ir-message">
                        You have a new ride request.
                    </p>
                    
                    <button className="ir-view-btn" onClick={() => navigate('/driver_start_ride')}>
                        View Ride
                    </button>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="ir-home-indicator">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default IncomingRequest;
