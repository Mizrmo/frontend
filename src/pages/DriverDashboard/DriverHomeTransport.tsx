import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import trackImg from '../../assets/Track.png';
import './DriverHomeTransport.css';

const DriverHomeTransport = () => {
    const navigate = useNavigate();
    return (
        <div className="home-screen-transport">
            {/* Map Asset Area */}
            <div className="hst-map-container">
                <img src={mapBg} alt="Map" className="hst-map-image" />
                
                {/* Central Track / Car Icon */}
                <div className="hst-track-indicator">
                    <div className="hst-map-halo"></div>
                    <div className="pulse-ripple one"></div>
                    <div className="pulse-ripple two"></div>
                    <div className="hst-car-pin">
                         <img src={trackImg} alt="Track" className="hst-car-track-icon" />
                    </div>
                </div>
            </div>

            {/* Top Bar with floating buttons */}
            <div className="hst-header">
                <div className="status-bar-wrapper">
                    <StatusBar dark />
                </div>
                <div className="hst-top-controls">
                    <button className="hst-icon-btn menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button className="hst-icon-btn bell">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V10c0-3.07-1.63-5.64-4.5-6.32V3a1.5 1.5 0 0 0-3 0v.68C7.64 4.36 6 6.92 6 10v6l-2 2v1h16v-1l-2-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Floating Action Button (ri:add-fill) */}
            <button className="hst-fab" onClick={() => navigate('/advertise_ride')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>

            {/* Bottom Navigation */}
            <MainNavigation activeTab="home" isDriver />
        </div>
    );
};

export default DriverHomeTransport;
