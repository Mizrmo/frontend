import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import mapBg from '../../assets/Map1.png';
import './EnableLocation.css';

const EnableLocation = () => {
    const navigate = useNavigate();

    return (
        <div className="enable-location-screen">
            <div className="background-map-placeholder">
                <img src={mapBg} alt="Map" className="map-image-bg" />
            </div>
            <div className="map-overlay" />

            <div className="status-bar-wrapper">
                <StatusBar dark={true} />
            </div>

            <div className="location-popup-container">
                <div className="location-popup">
                    <div className="location-illustration">
                        <div className="ripple-container">
                            <div className="ripple ripple-1" />
                            <div className="ripple ripple-2" />
                            <div className="ripple ripple-3" />
                            <div className="pin-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="location-text">
                        <h1>Enable Your Location</h1>
                        <p>Allow Mizrmo to access your location for a better ride booking experience.</p>
                    </div>

                    <div className="location-actions">
                        <button className="use-location-btn" onClick={() => navigate('/home_screen_Transport')}>
                            Use My Location
                        </button>
                        <button className="skip-link-btn" onClick={() => navigate('/home_screen_Transport')}>
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>

            <HomeIndicator />
        </div>
    );
};

export default EnableLocation;
