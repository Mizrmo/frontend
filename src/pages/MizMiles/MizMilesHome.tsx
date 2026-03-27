import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import SideNav from '../../components/SideNav';
import { SideNavContext } from '../../App';
import './MizMilesHome.css';

const MizMilesHome = () => {
    const navigate = useNavigate();
    const { setIsOpen } = useContext(SideNavContext);

    const rewards = [
        { id: 1, title: '15% of next ride', cost: '150 Miz Miles' },
        { id: 2, title: '15% of next ride', cost: '150 Miz Miles' },
        { id: 3, title: '15% of next ride', cost: '150 Miz Miles' },
    ];

    const FlowerSeal = () => (
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            {/* Smooth rounded scalloped seal-flower shape */}
            <path d="M12 2C13.29 2 14.53 2.65 15.27 3.73L15.42 3.96C16.12 5 17.43 5.43 18.61 5L18.86 4.9C20.07 4.4 21.46 4.9 22.08 6.07L22.16 6.22C22.77 7.39 22.56 8.84 21.64 9.77L21.46 9.95C20.61 10.8 20.61 12.2 21.46 13.05L21.64 13.23C22.56 14.16 22.77 15.61 22.16 16.78L22.08 16.93C21.46 18.1 20.07 18.6 18.86 18.1L18.61 18C17.43 17.57 16.12 18 15.42 19.04L15.27 19.27C14.53 20.35 13.29 21 12 21C10.71 21 9.47 20.35 8.73 19.27L8.58 19.04C7.88 18 6.57 17.57 5.39 18L5.14 18.1C3.93 18.6 2.54 18.1 1.92 16.93L1.84 16.78C1.23 15.61 1.44 14.16 2.36 13.23L2.54 13.05C3.39 12.2 3.39 10.8 2.54 9.95L2.36 9.77C1.44 8.84 1.23 7.39 1.84 6.22L1.92 6.07C2.54 4.9 3.93 4.4 5.14 4.9L5.39 5C6.57 5.43 7.88 5 8.58 3.96L8.73 3.73C9.47 2.65 10.71 2 12 2Z" fill="#0056B3" />
            {/* Percentage sign as detailed SVG paths */}
            <circle cx="9" cy="9" r="2.2" fill="white" />
            <circle cx="15" cy="15" r="2.2" fill="white" />
            <line x1="16" y1="8" x2="8" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="mmh-screen">
            <SideNav />
            {/* ── Header ── */}
            <div className="mmh-header">
                <StatusBar dark />
                <div className="mmh-nav-row">
                    <button className="mmh-back-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="mmh-page-title">Miz Miles</h1>
                    <button className="mmh-menu-trigger" onClick={() => setIsOpen(true)}>
                        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                            <line x1="0" y1="1" x2="18" y2="1" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
                            <line x1="0" y1="7" x2="18" y2="7" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
                            <line x1="0" y1="13" x2="18" y2="13" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mmh-scroll-area">
                {/* ── Points Carousel ── */}
                <div className="mmh-carousel">
                    <div className="mmh-points-card">
                        <div className="mmh-points-top">
                            <span className="mmh-points-label">Miz Points</span>
                            <button className="mmh-menu-dots">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <circle cx="5" cy="12" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="19" cy="12" r="2" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mmh-points-divider" />

                        <div className="mmh-points-bottom">
                            <span className="mmh-points-value">25500</span>
                            <button className="mmh-redeem-btn-top" onClick={() => navigate('/miz-miles-rewards')}>Redeem</button>
                        </div>
                    </div>
                    {/* Add more cards for demonstration if needed */}
                </div>

                {/* ── Rewards Header ── */}
                <div className="mmh-section-header">
                    <span className="mmh-section-title">Rewards</span>
                    <button className="mmh-see-all" onClick={() => navigate('/miz-miles-rewards')}>See All</button>
                </div>

                {/* ── Rewards List ── */}
                <div className="mmh-rewards-list">
                    {rewards.map((reward) => (
                        <div className="mmh-reward-card" key={reward.id}>
                            <div className="mmh-reward-icon-box">
                                <div className="mmh-seal-icon">
                                    <FlowerSeal />
                                </div>
                            </div>
                            
                            <div className="mmh-reward-info">
                                <div className="mmh-reward-top-row">
                                    <h3 className="mmh-reward-title">{reward.title}</h3>
                                    <button className="mmh-menu-dots-grey">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#898989">
                                            <circle cx="5" cy="12" r="2" />
                                            <circle cx="12" cy="12" r="2" />
                                            <circle cx="19" cy="12" r="2" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mmh-reward-bottom-row">
                                    <span className="mmh-reward-cost">{reward.cost}</span>
                                    <button className="mmh-redeem-link" onClick={() => navigate('/miz-miles')}>Redeem</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <MainNavigation activeTab="profile" />

            <div className="mmh-home-fix">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default MizMilesHome;
