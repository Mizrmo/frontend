import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './SendVerification.css';
import { forgotPassword } from '../../api/auth';

const SendVerification = () => {
    const navigate = useNavigate();
    const [contact, setContact] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword({ email: contact });
            navigate('/verify_otp', { state: { email: contact, phoneNumber: contact, isPasswordReset: true } });
        } catch (error: any) {
            console.error('Password reset initiation failed:', error);
            alert('Failed to send OTP: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="send-verification-screen">
            <div className="sv-status-bar">
                <StatusBar dark />
            </div>

            <div className="sv-header">
                <button className="sv-back-btn" onClick={handleBack}>
                    <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>

            <div className="sv-content">
                <h1 className="sv-title">Verify email or phone number</h1>

                <form className="sv-form" onSubmit={handleSendOTP}>
                    <div className="sv-input-wrap">
                        <input
                            type="text"
                            placeholder="Enter Email or Phone Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="sv-input"
                            required
                        />
                        <div className="sv-input-icons">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="4" width="18" height="18" rx="3" fill="#94A3B3" />
                                <rect x="7" y="2" width="2" height="4" rx="1" fill="#94A3B3" />
                                <rect x="15" y="2" width="2" height="4" rx="1" fill="#94A3B3" />
                                <rect x="3" y="9" width="18" height="2" fill="white" />
                                <circle cx="7" cy="14" r="1.2" fill="white" />
                                <circle cx="12" cy="14" r="1.2" fill="white" />
                                <circle cx="17" cy="14" r="1.2" fill="white" />
                                <circle cx="7" cy="18" r="1.2" fill="white" />
                                <circle cx="12" cy="18" r="1.2" fill="white" />
                                <circle cx="17" cy="18" r="1.2" fill="white" />
                            </svg>
                        </div>
                    </div>

                    <button type="submit" className="sv-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default SendVerification;
