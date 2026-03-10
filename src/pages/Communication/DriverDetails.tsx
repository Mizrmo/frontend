import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './DriverDetails.css';

const DriverDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="driver-details-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            {/* Header */}
            <header className="page-header">
                <button
                    className="back-icon-btn"
                    onClick={() => navigate(-1)}
                >
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="page-title" style={{ textAlign: 'center' }}>
                    Driver Details
                </h1>
                <div style={{ width: '28px' }} />
            </header>

            {/* Content */}
            <div className="driver-content">
                {/* Avatar */}
                <div className="driver-avatar-circle">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>

                <div className="driver-info-text">
                    <h2 className="driver-name">Daniel Asante</h2>
                    <p className="driver-meta">Professional Driver · 4.9 ★</p>
                </div>

                {/* Details card */}
                <div className="details-card">
                    {[
                        { label: 'Vehicle', value: 'Toyota Corolla · GR-1234-22' },
                        { label: 'Phone', value: '+233 20 000 0000' },
                        { label: 'Trips completed', value: '531' },
                    ].map(({ label, value }) => (
                        <div key={label} className="detail-row">
                            <span className="detail-label">{label}</span>
                            <span className="detail-value">{value}</span>
                        </div>
                    ))}
                </div>

                <button
                    className="confirm-ride-btn"
                    onClick={() => navigate('/driver-on-way')}
                >
                    Confirm Ride
                </button>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default DriverDetails;
