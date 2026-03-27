import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './DriverFavoriteRides.css';

const DriverFavoriteRides = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const favoriteRides = [
        { id: 1, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 2, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
    ];

    const favoriteDrivers = [
        { id: 3, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 4, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 5, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 6, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
    ];

    const filteredRides = favoriteRides.filter(ride =>
        ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDrivers = favoriteDrivers.filter(driver =>
        driver.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fr-screen"> {/* Reusing fr- class for parity */}
            <div className="fr-status-bar-wrapper">
                <StatusBar dark />
                <header className="fr-header">
                    <button className="fr-back-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="fr-header-title">Favourites</h1>
                    <div style={{ width: 60 }} />
                </header>
            </div>

            <div className="fr-search-wrap">
                <div className="fr-search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="search ride or driver"
                        className="fr-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="fr-scroll">
                {filteredRides.length === 0 && filteredDrivers.length === 0 && (
                    <div className="fr-empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p>No favorites found for "{searchQuery}"</p>
                    </div>
                )}

                {filteredRides.length > 0 && (
                    <>
                        <p className="fr-section-label">{filteredRides.length} {filteredRides.length === 1 ? 'Ride' : 'Rides'}</p>
                        <div className="fr-list">
                            {filteredRides.map(ride => (
                                <div key={ride.id} className="fr-card" onClick={() => navigate('/driver-ride-details')}>
                                    <div className="fr-card-icon-wrap">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                            <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="fr-card-content">
                                        <h3 className="fr-card-title">{ride.title}</h3>
                                        <p className="fr-card-sub">
                                            {ride.date}  |  {ride.price}  |  {ride.location}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {filteredDrivers.length > 0 && (
                    <>
                        <p className="fr-section-label" style={{ marginTop: 48 }}>{filteredDrivers.length} {filteredDrivers.length === 1 ? 'Driver' : 'Drivers'}</p>
                        <div className="fr-list">
                            {filteredDrivers.map(driver => (
                                <div key={driver.id} className="fr-card" onClick={() => navigate('/driver-details')}>
                                    <div className="fr-card-icon-wrap">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                            <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="fr-card-content">
                                        <h3 className="fr-card-title">{driver.title}</h3>
                                        <p className="fr-card-sub">
                                            {driver.date}  |  {driver.price}  |  {driver.location}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <button className="fr-fab" onClick={() => navigate('/driver_upcoming_trips')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
            </button>

            <MainNavigation activeTab="favorites" isDriver={true} />

            <HomeIndicator dark />
        </div>
    );
};

export default DriverFavoriteRides;
