import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './DriverDocuments.css';

const DriverDocuments = () => {
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
            <StatusBar dark />
            <header className="doc-header">
                <button className="doc-back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="doc-title">Document</h1>
            </header>

            <div className="doc-content nice-scroll">
                <div className="doc-list">
                    {documentItems.map((item) => (
                        <div
                            key={item.id}
                            className="doc-item"
                            onClick={() => {
                                if (item.title === 'Ghana Card Verification') navigate('/driver-ghana-card');
                                if (item.title === 'Personal Information') navigate('/driver-profile');
                            }}
                        >
                            <div className="doc-item-info">
                                <h3 className="doc-item-title">{item.title}</h3>
                                <span className={`doc-item-status ${item.completed ? 'completed' : 'not-completed'}`}>
                                    {item.completed ? 'Completed' : 'Not Completed'}
                                </span>
                            </div>
                            <div className="doc-chevron">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <MainNavigation activeTab="profile" isDriver={true} />
            <HomeIndicator dark />
        </div>
    );
};

export default DriverDocuments;
