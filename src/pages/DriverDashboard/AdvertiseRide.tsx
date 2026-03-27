import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import './AdvertiseRide.css';

const recentPlaces = [
    { id: 1, name: 'Office', sub: 'Community one', dist: '2.7km' },
    { id: 2, name: 'Coffee shop', sub: 'somewhere', dist: '1.1km' },
    { id: 3, name: 'Shopping center', sub: 'Tema', dist: '4.9km' },
];

const AdvertiseRide = () => {
    const navigate = useNavigate();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [date, setDate] = useState('17-10-24');
    const [time, setTime] = useState('6:00PM');

    return (
        <div className="advertise-ride-screen">
            {/* Map Background */}
            <div className="ar-map-bg">
                <img src={mapBg} alt="Map" className="ar-map-image" />
            </div>

            {/* Dark Overlay #262626 at 70% opacity */}
            <div className="ar-dark-overlay" onClick={() => navigate('/driver-home')} />

            {/* Status Bar floating on top */}
            <div className="ar-status-bar">
                <StatusBar dark />
            </div>

            {/* Floating Header Controls */}
            <div className="ar-header-controls">
                <button className="ar-icon-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button className="ar-icon-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V10c0-3.07-1.63-5.64-4.5-6.32V3a1.5 1.5 0 0 0-3 0v.68C7.64 4.36 6 6.92 6 10v6l-2 2v1h16v-1l-2-2z" />
                    </svg>
                </button>
            </div>

            {/* Bottom Sheet (Rectangle 548) */}
            <div className="ar-sheet">
                {/* Drag Handle */}
                <div className="ar-drag-handle"></div>

                {/* Title */}
                <h2 className="ar-title">Advertise Ride</h2>
                <div className="ar-divider"></div>

                {/* Pick Up Input */}
                <div className="ar-input-group">
                    <input
                        type="text"
                        className="ar-input"
                        placeholder="Pick Up"
                        value={pickup}
                        onChange={e => setPickup(e.target.value)}
                    />
                    <span className="ar-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                        </svg>
                    </span>
                </div>

                {/* Drop Off Input */}
                <div className="ar-input-group">
                    <input
                        type="text"
                        className="ar-input"
                        placeholder="Drop Off"
                        value={dropoff}
                        onChange={e => setDropoff(e.target.value)}
                    />
                    <span className="ar-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                        </svg>
                    </span>
                </div>

                {/* Date & Time Row */}
                <div className="ar-datetime-row">
                    <div className="ar-datetime-pill">
                        <span className="ar-dt-label">Date</span>
                        <span className="ar-dt-value">{date}</span>
                    </div>
                    <div className="ar-datetime-pill">
                        <span className="ar-dt-label">Pickup Time</span>
                        <span className="ar-dt-value">{time}</span>
                    </div>
                </div>

                {/* Advertise Button */}
                <button className="ar-advertise-btn" onClick={() => navigate('/driver-search-location')}>
                    Advertise
                </button>

                <div className="ar-divider"></div>

                {/* Recent Places */}
                <div className="ar-recent-section">
                    <p className="ar-recent-title">Recent places</p>
                    <ul className="ar-recent-list">
                        {recentPlaces.map(place => (
                            <li key={place.id} className="ar-recent-item">
                                <span className="ar-pin-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#132235" strokeWidth="2">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                        <circle cx="12" cy="9" r="2.5" />
                                    </svg>
                                </span>
                                <div className="ar-place-info">
                                    <span className="ar-place-name">{place.name}</span>
                                    <span className="ar-place-sub">{place.sub}</span>
                                </div>
                                <span className="ar-place-dist">{place.dist}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="ar-home-indicator-wrap">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default AdvertiseRide;
