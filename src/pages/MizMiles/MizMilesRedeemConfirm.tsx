import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './MizMilesRedeemConfirm.css';

const MizMilesRedeemConfirm = () => {
    const navigate = useNavigate();

    const rewards = [
        { id: 1, title: '15% of next ride', cost: '150 Miz Miles' },
        { id: 2, title: '15% of next ride', cost: '150 Miz Miles' },
        { id: 3, title: '15% of next ride', cost: '150 Miz Miles' },
    ];

    const FlowerSeal = () => (
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C13.29 2 14.53 2.65 15.27 3.73L15.42 3.96C16.12 5 17.43 5.43 18.61 5L18.86 4.9C20.07 4.4 21.46 4.9 22.08 6.07L22.16 6.22C22.77 7.39 22.56 8.84 21.64 9.77L21.46 9.95C20.61 10.8 20.61 12.2 21.46 13.05L21.64 13.23C22.56 14.16 22.77 15.61 22.16 16.78L22.08 16.93C21.46 18.1 20.07 18.6 18.86 18.1L18.61 18C17.43 17.57 16.12 18 15.42 19.04L15.27 19.27C14.53 20.35 13.29 21 12 21C10.71 21 9.47 20.35 8.73 19.27L8.58 19.04C7.88 18 6.57 17.57 5.39 18L5.14 18.1C3.93 18.6 2.54 18.1 1.92 16.93L1.84 16.78C1.23 15.61 1.44 14.16 2.36 13.23L2.54 13.05C3.39 12.2 3.39 10.8 2.54 9.95L2.36 9.77C1.44 8.84 1.23 7.39 1.84 6.22L1.92 6.07C2.54 4.9 3.93 4.4 5.14 4.9L5.39 5C6.57 5.43 7.88 5 8.58 3.96L8.73 3.73C9.47 2.65 10.71 2 12 2Z" fill="#0056B3" />
            <circle cx="9" cy="9" r="2.2" fill="white" />
            <circle cx="15" cy="15" r="2.2" fill="white" />
            <line x1="16" y1="8" x2="8" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="mmc-screen">
            {/* ── Base Home Content (Will be blurred) ── */}
            <div className="mmc-base-content">
                <div className="mmc-header">
                    <StatusBar dark />
                    <div className="mmc-nav-row">
                        <button className="mmc-back-btn" onClick={() => navigate(-1)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <h1 className="mmc-page-title">Miz Miles</h1>
                        <div className="mmc-spacer" />
                    </div>
                </div>

                <div className="mmc-scroll-area">
                    <div className="mmc-carousel">
                        <div className="mmc-points-card">
                            <div className="mmc-points-top">
                                <span className="mmc-points-label">Miz Points</span>
                                <button className="mmc-menu-dots">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <circle cx="5" cy="12" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="19" cy="12" r="2" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mmc-points-divider" />
                            <div className="mmc-points-bottom">
                                <span className="mmc-points-value">25500</span>
                                <button className="mmc-redeem-btn-top">Redeem</button>
                            </div>
                        </div>
                    </div>

                    <div className="mmc-section-header">
                        <span className="mmc-section-title">Rewards</span>
                        <button className="mmc-see-all">See All</button>
                    </div>

                    <div className="mmc-rewards-list">
                        {rewards.map((reward) => (
                            <div className="mmc-reward-card" key={reward.id}>
                                <div className="mmc-reward-icon-box"><div className="mmc-seal-icon"><FlowerSeal /></div></div>
                                <div className="mmc-reward-info">
                                    <div className="mmc-reward-top-row">
                                        <h3 className="mmc-reward-title">{reward.title}</h3>
                                        <button className="mmc-menu-dots-grey">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#898989"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
                                        </button>
                                    </div>
                                    <div className="mmc-reward-bottom-row">
                                        <span className="mmc-reward-cost">{reward.cost}</span>
                                        <button className="mmc-redeem-link">Redeem</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <MainNavigation activeTab="profile" />
                <div className="mmc-home-fix"><HomeIndicator dark /></div>
            </div>

            {/* ── Backdrop Overlay ── */}
            <div className="mmc-backdrop-overlay" />

            {/* ── Modal Container ── */}
            <div className="mmc-modal-container">
                <div className="mmc-modal-box">
                    <button className="mmc-close-btn" onClick={() => navigate('/miz-miles')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#898989" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="mmc-modal-content">
                        <div className="mmc-car-halo">
                            <div className="mmc-car-icon-wrap">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="#0056B3">
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 7H17.5L18.83 11H5.17L6.5 7ZM7 16C5.9 16 5 15.1 5 14C5 12.9 5.9 12 7 12C8.1 12 9 12.9 9 14C9 15.1 8.1 16 7 16ZM17 16C15.9 16 15 15.1 15 14C15 12.9 15.9 12 17 12C18.1 12 19 12.9 19 14C19 15.1 18.1 16 17 16Z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="mmc-modal-title">Trade 150 Miz Miles for <br /> a Ride</h2>

                        <button className="mmc-confirm-btn" onClick={() => navigate('/miz-miles')}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MizMilesRedeemConfirm;
