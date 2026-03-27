import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import trackImg from '../../assets/Track.png';
import danielImg from '../../assets/avatars/DanielAsante.png';
import carImg from '../../assets/cars/ToyotaVitz.png';
import './DriverSearchLocation.css';

const DriverSearchLocation = () => {
    const navigate = useNavigate();

    return (
        <div className="dsl-screen">
            {/* Map Background */}
            <div className="dsl-map-bg">
                <img src={mapBg} alt="Map" className="dsl-map-image" />
                <div className="dsr-track-car">
                    <img src={trackImg} alt="Track" className="dsr-car-track-icon" />
                </div>
            </div>

            {/* Dark Overlay #262626 at 70% - click navigates back */}
            <div className="dsl-dark-overlay" onClick={() => navigate('/driver-home')} />

            {/* Status Bar */}
            <div className="dsl-status-bar">
                <StatusBar dark />
            </div>

            {/* Floating Header Controls */}
            <div className="dsl-header-controls">
                <button className="dsl-icon-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button className="dsl-icon-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V10c0-3.07-1.63-5.64-4.5-6.32V3a1.5 1.5 0 0 0-3 0v.68C7.64 4.36 6 6.92 6 10v6l-2 2v1h16v-1l-2-2z" />
                    </svg>
                </button>
            </div>

            {/* Bottom Sheet - Ride Confirm Details */}
            <div className="dsl-sheet">
                {/* Drag Handle */}
                <div className="dsl-drag-handle" />

                {/* Title */}
                <h2 className="dsl-title">Ride Confirmation</h2>
                <div className="dsl-divider" />

                <div className="dsl-frame-2391">
                    {/* Locations Container */}
                    <div className="dsl-locations-container">
                        {/* Current Location */}
                        <div className="dsl-location-row">
                            <span className="dsl-loc-icon current">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#0056B3" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="5" fill="#0056B3" />
                                </svg>
                            </span>
                            <div className="dsl-loc-info">
                                <span className="dsl-loc-name">Current location</span>
                                <span className="dsl-loc-sub">Ashaiman, main station</span>
                            </div>
                        </div>

                        {/* Drop off Location */}
                        <div className="dsl-location-row">
                            <span className="dsl-loc-icon dropoff">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#FFCC00" />
                                </svg>
                            </span>
                            <div className="dsl-loc-info">
                                <span className="dsl-loc-name">Drop off Location</span>
                                <span className="dsl-loc-sub">Community One</span>
                            </div>
                            <span className="dsl-dist">2.2km</span>
                        </div>
                    </div>

                    <div className="dsl-divider" />

                    {/* Driver Row - Unboxed as per Figma mockup 19 */}
                    <div className="dsl-driver-row">
                        <div className="dsl-avatar">
                            <img src={danielImg} alt="Daniel Asante" className="dsl-avatar-img" />
                        </div>
                        <div className="dsl-driver-info">
                            <span className="dsl-driver-name">Daniel Asante</span>
                            <span className="dsl-driver-meta">26yrs &nbsp;•&nbsp; Driver</span>
                        </div>
                    </div>

                    <div className="dsl-divider" />

                    {/* Vehicle Card - Boxed as per Figma mockup 19 */}
                    <div className="dsl-vehicle-card">
                        <div className="dsl-car-icon">
                            <img src={carImg} alt="Toyota Vitz" className="dsl-car-img" />
                        </div>
                        <div className="dsl-vehicle-info">
                            <span className="dsl-vehicle-name">Toyota Vitz - GT 8432 -23</span>
                            <div className="dsl-rating-row">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFCC00">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className="dsl-rating-text">4.5 (21 Reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fare */}
                <div className="dsl-fare-section">
                    <p className="dsl-fare-label">Fare</p>
                    <div className="dsl-fare-row">
                        <span className="dsl-fare-key">Total trip Cost</span>
                        <span className="dsl-fare-val">GHc22.00</span>
                    </div>
                </div>

                {/* Advertise Ride Button */}
                <button className="dsl-advertise-btn" onClick={() => navigate('/ride_advertised_confirmation')}>
                    Advertise Ride
                </button>
            </div>

            {/* Home Indicator */}
            <div className="dsl-home-indicator">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default DriverSearchLocation;
