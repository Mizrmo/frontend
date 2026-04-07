import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import walletMainIcon from '../../assets/Frame 427319755.png';
import bankIcon from '../../assets/Bank.png';
import walletOptionIcon from '../../assets/Wallet 2.png';
import './DriverWithdrawal.css';

const DriverWithdrawal: React.FC = () => {
    const navigate = useNavigate();
    const [modalType, setModalType] = React.useState<'success' | 'failed' | null>(null);

    const handleWithdraw = () => {
        // For demonstration, you can toggle between success and failed
        setModalType('success');
    };

    return (
        <div className="dw-screen">
            <StatusBar dark />
            
            <header className="dw-header">
                <button className="dw-back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="dw-title">Withdrawal</h1>
            </header>

            <div className="dw-content nice-scroll">
                {/* Amount Input */}
                <div className="dw-input-group">
                    <input 
                        type="text" 
                        className="dw-amount-input" 
                        placeholder="Withdrawal Amount"
                    />
                </div>

                {/* Pay To Section */}
                <span className="dw-section-label">Pay To</span>

                <div className="dw-payment-list">
                    {/* Bank Option */}
                    <div className="dw-payment-item">
                        <div className="dw-item-icon">
                            <img src={bankIcon} alt="Bank" style={{ width: 24, height: 24 }} />
                        </div>
                        <div className="dw-item-details">
                            <span className="dw-item-name">Consolidated Bank</span>
                            <span className="dw-item-subtext">12********49</span>
                        </div>
                    </div>

                    {/* Mobile Money Option */}
                    <div className="dw-payment-item">
                        <div className="dw-item-icon">
                            <img src={walletOptionIcon} alt="Wallet" style={{ width: 24, height: 24 }} />
                        </div>
                        <div className="dw-item-details">
                            <span className="dw-item-name">Mtn Mobile Money</span>
                            <span className="dw-item-subtext">05********49</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button className="dw-withdraw-btn" onClick={handleWithdraw}>
                    Withdraw
                </button>
            </div>

            {/* Modal Overlay */}
            {modalType && (
                <div className="dw-modal-overlay" onClick={() => navigate(-1)}>
                    <div className="dw-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="dw-modal-close" onClick={() => setModalType(null)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="dw-success-icon-container">
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                {/* Base Circle */}
                                <circle cx="60" cy="62" r="30" fill="#2563EB" />
                                {modalType === 'success' ? (
                                    <path d="M52 62L58 68L68 56" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                ) : (
                                    <path d="M54 56L66 68M66 56L54 68" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                )}
                                
                                {/* Decorator Dots */}
                                <circle cx="60" cy="20" r="3" fill="#2563EB" opacity="0.6" />
                                <circle cx="85" cy="28" r="4" fill="#2563EB" />
                                <circle cx="100" cy="55" r="3" fill="#2563EB" opacity="0.8" />
                                <circle cx="95" cy="85" r="4" fill="#2563EB" opacity="0.4" />
                                <circle cx="60" cy="105" r="3" fill="#2563EB" />
                                <circle cx="25" cy="85" r="5" fill="#2563EB" />
                                <circle cx="15" cy="55" r="2" fill="#2563EB" opacity="0.6" />
                            </svg>
                        </div>

                        <h2 className="dw-success-title">
                            withdrawal {modalType === 'success' ? 'Successful' : 'Failed'}
                        </h2>
                        <p className="dw-success-text">
                            {modalType === 'success' ? (
                                <>An amount of <span className="dw-success-amt">GH₵202.00</span> has been transferred to your account</>
                            ) : (
                                "Failed to process withdrawal. Please try again later"
                            )}
                        </p>
                    </div>
                </div>
            )}

            <footer className="dw-footer">
                <MainNavigation activeTab="profile" isDriver={true} />
            </footer>
        </div>
    );
};

export default DriverWithdrawal;
