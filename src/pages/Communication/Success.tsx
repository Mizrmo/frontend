import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './Success.css';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className="success-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <div className="success-content">
                {/* Success Icon */}
                <div className="success-icon-wrap">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

                <h1 className="success-title">
                    Account Created!
                </h1>

                <p className="success-message">
                    Welcome to Mizrmo! Your account has been successfully created. Start booking rides today.
                </p>

                <button
                    className="get-started-btn"
                    onClick={() => navigate('/enable-location')}
                >
                    Get Started
                </button>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default Success;
