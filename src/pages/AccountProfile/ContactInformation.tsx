import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './ContactInformation.css';

const ContactInformation = () => {
    const navigate = useNavigate();

    const contactItems = [
        { id: 1, label: 'Phone Number', value: '+233 55 123 4567' },
        { id: 2, label: 'Email', value: 'ashartey2@gmail.com' },
    ];

    return (
        <div className="ci-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <header className="ci-header">
                    <button className="ci-back-btn" onClick={() => navigate(-1)}>
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 16L2 9L9 2" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="ci-title">ID Information</h1>
                    <div style={{ width: 60 }} />
                </header>
            </div>

            <div className="ci-content nice-scroll">
                <div className="ci-list">
                    {contactItems.map((item) => (
                        <div
                            key={item.id}
                            className="ci-item"
                            onClick={() => navigate('/profile-setup')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="ci-item-left">
                                <h3 className="ci-item-label">{item.label}</h3>
                                <p className="ci-item-value">{item.value}</p>
                            </div>
                            <button className="ci-change-btn">Change</button>
                        </div>
                    ))}
                </div>
            </div>

            <MainNavigation activeTab="profile" />
            <HomeIndicator dark />
        </div>
    );
};

export default ContactInformation;
