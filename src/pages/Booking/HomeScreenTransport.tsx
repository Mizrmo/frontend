import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
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
            <MainNavigation activeTab="home" />

            <HomeIndicator dark />
        </div>
    );
};

export default HomeScreenTransport;
