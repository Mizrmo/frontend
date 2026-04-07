import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import trackImg from '../../assets/Track.png';
import janeImg from '../../assets/lady_profile.png';
import callIconImg from '../../assets/call.png';
import chatIconImg from '../../assets/Chat.png';
import './DriverStartRide.css';

const DriverStartRide = () => {
    const navigate = useNavigate();
    // Ride Status Life Cycle: 'initial' -> 'arrived' -> 'in-progress' -> 'complete'
    const [status, setStatus] = useState<'initial' | 'arrived' | 'in-progress' | 'complete'>('initial');

    const handleAccept = () => setStatus('arrived');
    const handleAtPickup = () => setStatus('in-progress');
    const handleFinishRide = () => navigate('/rate_trip_rider');
    const handleCancel = () => navigate('/driver-home');

    return (
        <div className="dsr-screen">
            {/* Map Background */}
            <div className="dsr-map-bg">
                <img src={mapBg} alt="Map" className="dsr-map-image" />
                
                {/* Car Track Icon */}
                <div className="dsr-track-car">
                    <img src={trackImg} alt="Track" className="dsr-car-image-track" />
                </div>

                {/* Path Line */}
                <div className="dsr-map-line" />

                {/* Destination Marker */}
                <div className="dsr-map-dest">
                    <div className="dsr-dest-pulse" />
                    <div className="dsr-dest-pin" />
                </div>
                
                <div className="dsr-map-overlay" />
            </div>

            {/* Header / Back */}
            <div className="dsr-header">
                <StatusBar dark />
                <button className="dsr-back-btn" onClick={() => navigate('/incoming-request')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>

            {/* Bottom Sheet - The scrollable details */}
            <div className="dsr-sheet">
                <div className="dsr-drag-handle" />

                {/* Top Action Row (Time & Start) */}
                <div className="dsr-top-action-row">
                    <div className="dsr-arrival-time">
                        <span className="dsr-time-value">00: 01: 24</span>
                        <span className="dsr-time-label">Estimated Arrival time</span>
                    </div>
                    <button className="dsr-start-btn">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                        <span>Start</span>
                    </button>
                </div>

                <div className="dsr-divider" />

                {/* Locations Section */}
                <div className="dsr-locations">
                    <div className="dsr-loc-row">
                        <div className="dsr-loc-marker-wrap">
                            <div className="dsr-marker-blue-premium">
                                <div className="dsr-marker-inner-white">
                                    <div className="dsr-marker-center-dot" />
                                </div>
                            </div>
                            <div className="dsr-marker-line" />
                        </div>
                        <div className="dsr-loc-info">
                            <span className="dsr-loc-label">Pickup location</span>
                            <span className="dsr-loc-name">Ashaiman, main station</span>
                        </div>
                    </div>
                    <div className="dsr-loc-row">
                        <div className="dsr-loc-marker-wrap">
                            <div className="dsr-pin-halo">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="dsr-pin-yellow">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#FFCC00" />
                                </svg>
                            </div>
                        </div>
                        <div className="dsr-loc-info">
                            <span className="dsr-loc-label">Drop off Location</span>
                            <span className="dsr-loc-name">Community One</span>
                        </div>
                        <span className="dsr-dist">2.2km</span>
                    </div>
                </div>

                <div className="dsr-divider" />

                {/* Passenger Row */}
                <div className="dsr-passenger-row">
                    <div className="dsr-passenger-info">
                        <div className="dsr-passenger-avatar">
                            <img src={janeImg} alt="Jane Asantewa" />
                        </div>
                        <span className="dsr-passenger-name">Jane Asantewa</span>
                    </div>
                    <div className="dsr-passenger-actions">
                        <button className="dsr-action-btn call">
                            <img src={callIconImg} alt="Call" />
                        </button>
                        <button className="dsr-action-btn msg blue-bg" onClick={() => navigate('/chat')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="dsr-divider" />

                {/* Fare Row */}
                <div className="dsr-fare-row">
                    <div className="dsr-fare-icon-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                             <rect x="2" y="5" width="20" height="14" rx="2" />
                             <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                    <div className="dsr-fare-info">
                        <span className="dsr-fare-amount">GH¢22.00</span>
                        <span className="dsr-fare-label">Fare for Trip</span>
                    </div>
                </div>

                {/* Dynamic Submit Actions based on Status */}
                <div className="dsr-footer-btns">
                    {status === 'initial' && (
                        <>
                            <button className="dsr-primary-btn" onClick={handleAccept}>Accept Ride</button>
                            <button className="dsr-secondary-btn" onClick={handleCancel}>Cancel Ride</button>
                        </>
                    )}
                    {status === 'arrived' && (
                        <button className="dsr-secondary-btn" onClick={handleAtPickup}>At Pickup</button>
                    )}
                    {status === 'in-progress' && (
                        <button className="dsr-primary-btn" onClick={handleFinishRide}>Finish Ride</button>
                    )}
                    {(status === 'initial' || status === 'arrived') && (
                        <button className="dsr-secondary-btn" onClick={handleCancel}>Cancel Ride</button>
                    )}
                </div>
            </div>

            {/* Main Navigation Tab Bar */}
            <MainNavigation activeTab="trips" isDriver={true} />

            {/* Home Indicator */}
            <div className="dsr-home-indicator">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default DriverStartRide;
