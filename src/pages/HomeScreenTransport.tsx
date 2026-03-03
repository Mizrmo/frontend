import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import mapBg from '../assets/map-bg.png';
import './HomeScreenTransport.css';

const HomeScreenTransport = () => {
    const navigate = useNavigate();

    const rides = [
        {
            id: 1,
            title: 'Tema Community One',
            price: 'GH¢22',
            car: 'Toyota Vitz',
            seats: '3 seats',
            location: 'Community one',
            time: '5mins away'
        },
        {
            id: 2,
            title: 'Tema Community One',
            price: 'GH¢22',
            car: 'Toyota Vitz',
            seats: '3 seats',
            location: 'Community one',
            time: '5mins away'
        }
    ];

    return (
        <div className="home-transport-screen">
            {/* Map Background & Locator */}
            <div className="map-container">
                <img src={mapBg} alt="Map" className="map-image-bg" />

                {/* Center Pin & Pulse */}
                <div className="center-pin-container">
                    <div className="pulse-outer"></div>
                    <div className="pulse-inner"></div>
                    <div className="map-pin">
                        <div className="pin-head"></div>
                    </div>
                </div>
            </div>

            {/* Top Navigation Overlay */}
            <div className="top-nav-overlay">
                <StatusBar dark />
                <div className="header-actions">
                    <button className="icon-circle-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                    <button className="icon-circle-btn" onClick={() => navigate('/notifications')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <div className="notification-dot"></div>
                    </button>
                </div>
            </div>

            {/* Bottom Drawer */}
            <div className="transport-bottom-sheet">
                <div className="sheet-drag-handle"></div>

                <div className="search-input-pill" onClick={() => navigate('/search-location')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Book ride" readOnly />
                </div>

                <div className="rides-section">
                    <h2 className="section-title">Available rides</h2>
                    <div className="rides-list">
                        {rides.map(ride => (
                            <div key={ride.id} className="ride-card" onClick={() => navigate('/available-rides')}>
                                <div className="ride-icon-circle">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                        <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="ride-info">
                                    <div className="ride-header">
                                        <span className="ride-destination">{ride.title}</span>
                                        <span className="ride-price">{ride.price}</span>
                                    </div>
                                    <div className="ride-details-row">
                                        <span>{ride.car}</span>
                                        <span className="info-dot">•</span>
                                        <span>{ride.seats}</span>
                                        <span className="info-dot">•</span>
                                        <span>{ride.location}</span>
                                    </div>
                                    <div className="ride-time">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>{ride.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Tab Navigation */}
            <div className="tab-bar">
                <button className="tab-item active" onClick={() => navigate('/home_screen_Transport')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="#0056B3">
                            <circle cx="12" cy="11" r="8" stroke="currentColor" strokeWidth="2.1" />
                            <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="2.1" />
                            <path d="M12 21L9 18H15L12 21Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span>Home</span>
                </button>
                <button className="tab-item">
                    <div className="tab-icon-wrap" style={{ width: '25px', height: '25px' }}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5.5V1.5H24V23.5H4.5V20.5H1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.5 19.5V6.5H20.5V23.5H4.5Z" stroke="black" strokeWidth="1.5" />
                            <circle cx="12.5" cy="15" r="4.5" stroke="black" strokeWidth="1.5" />
                            <path d="M1.5 5.5L24 2.5" stroke="black" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <span>Trips</span>
                </button>
                <button className="tab-item" onClick={() => navigate('/favorite-rides')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="black">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
                            <path d="M16 6.5C17.5 6.5 18.5 7.5 18.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                            <circle cx="16" cy="7.5" r="1.2" fill="white" />
                        </svg>
                    </div>
                    <span>Favorites</span>
                </button>
                <button className="tab-item" onClick={() => navigate('/account-settings')}>
                    <div className="tab-icon-wrap" style={{ width: '25px', height: '25px' }}>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <span>Profile</span>
                </button>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default HomeScreenTransport;
