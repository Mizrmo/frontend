import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './UserDocuments.css';

const UserDocuments = () => {
    const navigate = useNavigate();

    const documentItems = [
        { id: 1, title: 'Personal Information', completed: true },
        { id: 2, title: 'Ghana Card Verification', completed: true },
        { id: 3, title: 'Driver’s Licence', completed: true },
        { id: 4, title: 'Vehicle Insurance', completed: false },
        { id: 5, title: 'Road Worthy Certificate', completed: false },
    ];

    return (
        <div className="doc-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <header className="doc-header">
                    <button className="doc-back-btn" onClick={() => navigate(-1)}>
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 16L2 9L9 2" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="doc-title">Document</h1>
                    <div style={{ width: 60 }} />
                </header>
            </div>

            <div className="doc-content nice-scroll">
                <div className="doc-list">
                    {documentItems.map((item) => (
                        <div
                            key={item.id}
                            className="doc-item"
                            onClick={() => {
                                if (item.title === 'Ghana Card Verification') navigate('/ghana-card');
                                if (item.title === 'Personal Information') navigate('/contact-info');
                            }}
                            style={{ cursor: (item.title === 'Ghana Card Verification' || item.title === 'Personal Information') ? 'pointer' : 'default' }}
                        >
                            <h3 className="doc-item-title">{item.title}</h3>
                            <span className={`doc-item-status ${item.completed ? 'completed' : 'not-completed'}`}>
                                {item.completed ? 'Completed' : 'Not Completed'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <MainNavigation activeTab="profile" />
            <HomeIndicator dark />
        </div>
    );
};

export default UserDocuments;
