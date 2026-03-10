import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import mapBg from '../../assets/Map1.png';
import './SearchLocation.css';

const SearchLocation = () => {
    const navigate = useNavigate();

    const recentPlaces = [
        { id: 1, name: 'Office', address: 'Community one', distance: '2.7km' },
        { id: 2, name: 'Coffee shop', address: 'somewhere', distance: '1.1km' },
        { id: 3, name: 'Shopping center', address: 'Tema Community 4', distance: '4.9km' }
    ];

    const handleBack = () => {
        navigate('/home_screen_Transport');
    };

    const handleSearch = () => {
        navigate('/available-rides');
    };

    return (
        <div className="search-location-screen">
            {/* Background Map & Overlay */}
            <div className="search-map-bg">
                <img src={mapBg} alt="Map" />
                <div className="map-dim-overlay"></div>
            </div>

            {/* Top Navigation Overlay */}
            <div className="search-top-overlay" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
                <StatusBar dark={false} />
            </div>

            {/* Bottom Sheet */}
            <div className="search-bottom-sheet">
                <div className="sheet-handle-bar"></div>

                <div className="sheet-content-scroll">
                    <h1 className="search-title-text">Search For A Ride</h1>
                    <div className="search-divider-line"></div>

                    <div className="search-input-section">
                        <div className="modern-input-field">
                            <input type="text" placeholder="Pick Up" />
                            <div className="icon-gray">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                                    <circle cx="12" cy="12" r="8" strokeOpacity="0.3" />
                                </svg>
                            </div>
                        </div>

                        <div className="modern-input-field">
                            <input type="text" placeholder="Drop Off" />
                            <div className="icon-gray">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                        </div>

                        <div className="datetime-row">
                            <div className="modern-input-field">
                                <span className="field-label">Date</span>
                                <span className="field-value">17-10-24</span>
                            </div>
                            <div className="modern-input-field">
                                <span className="field-label">Pickup Time</span>
                                <span className="field-value">6:00PM</span>
                            </div>
                        </div>
                    </div>

                    <button className="search-btn-primary" onClick={handleSearch}>
                        Search
                    </button>

                    <div className="recent-places-wrap">
                        <h2 className="recent-places-title">Recent places</h2>
                        <div className="recent-places-list">
                            {recentPlaces.map(place => (
                                <div key={place.id} className="recent-place-item" onClick={handleBack}>
                                    <div className="location-icon-circle yellow-pin">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="place-text-wrap">
                                        <span className="place-main-name">{place.name}</span>
                                        <span className="place-sub-addr">{place.address}</span>
                                    </div>
                                    <span className="place-distance">{place.distance}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <HomeIndicator dark={true} />
        </div>
    );
};

export default SearchLocation;
