import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import './DriverContactInfo.css';

const DriverContactInfo = () => {
    const navigate = useNavigate();

    const contactItems = [
        { id: 1, label: 'Phone Number', value: '+233 55 123 4567' },
        { id: 2, label: 'Email', value: 'daniel122@gmail.com' },
    ];

    return (
        <div className="dci-screen">
            <StatusBar dark />
            
            <header className="dci-header">
                <button className="dci-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="dci-title">ID Information</h1>
                <div style={{ width: 60 }} />
            </header>

            <div className="dci-content">
                <div className="dci-list">
                    {contactItems.map((item) => (
                        <div
                            key={item.id}
                            className="dci-item"
                            onClick={() => navigate('/driver/profile-setup')}
                        >
                            <div className="dci-item-left">
                                <h3 className="dci-item-label">{item.label}</h3>
                                <p className="dci-item-value">{item.value}</p>
                            </div>
                            <button className="dci-change-btn">Change</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dci-footer">
                <MainNavigation activeTab="profile" isDriver={true} />
            </div>
        </div>
    );
};

export default DriverContactInfo;
