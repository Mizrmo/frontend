import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './SetPassword.css';

function SetNewPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { identifier, otp } = location.state || {};

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [activeField, setActiveField] = useState<'password' | 'confirmPassword'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Custom Keypad Logic
    const handleKeyClick = (val: string) => {
        setFormData(prev => ({
            ...prev,
            [activeField]: prev[activeField] + val
        }));
    };

    const handleDelete = () => {
        setFormData(prev => ({
            ...prev,
            [activeField]: prev[activeField].slice(0, -1)
        }));
    };

    const handleSave = async () => {
        if (!formData.password || !formData.confirmPassword) {
            alert('Please enter and confirm your password');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                identifier,
                otp,
                newPassword: formData.password
            });
            alert('Password reset successfully!');
            navigate('/signin');
        } catch (error: any) {
            console.error('Password reset failed:', error);
            alert('Failed to reset password: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Keyboard Key Data (Standard Layout)
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
        ['123', 'space', 'return']
    ];

    return (
        <div className="set-password-page no-scroll">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <div className="nav-actions-row">
                    <button className="back-text-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                </div>
            </div>

            <div className="set-password-content">
                <div className="title-section centered">
                    <h1 className="registration-title">Set New password</h1>
                    <p className="registration-subtitle">Set your password</p>
                </div>

                <div className="mobile-form">
                    <div className={`password-group ${activeField === 'password' ? 'active' : ''}`}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Your New Password"
                            value={formData.password}
                            onFocus={() => setActiveField('password')}
                            readOnly
                        />
                        <div className="sv-input-icons" style={{ gap: '10px' }}>
                            <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} style={{ position: 'static' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    {!showPassword ? (
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14.12 14.12a3 3 0 11-4.24-4.24" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="#B8B8B8" strokeWidth="2.5" />
                                        </>
                                    )}
                                </svg>
                            </button>
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

                    <div className={`password-group ${activeField === 'confirmPassword' ? 'active' : ''}`}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onFocus={() => setActiveField('confirmPassword')}
                            readOnly
                        />
                        <div className="sv-input-icons" style={{ gap: '10px' }}>
                            <button className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'static' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    {!showConfirmPassword ? (
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14.12 14.12a3 3 0 11-4.24-4.24" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="#B8B8B8" strokeWidth="2.5" />
                                        </>
                                    )}
                                </svg>
                            </button>
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

                    <button className="btn-rider" onClick={handleSave} disabled={isLoading} style={{ marginTop: '20px' }}>
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* Custom Alphanumeric Keyboard */}
            <div className="alphanumeric-keyboard">
                <div className="keyboard-suggested">
                    <span>I</span>
                    <span>Ride</span>
                    <span>Go</span>
                </div>
                {keyboardRows.map((row, i) => (
                    <div key={i} className={`kb-row kb-row-${i}`}>
                        {row.map(key => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (key === 'backspace') handleDelete();
                                    else if (key === 'space') handleKeyClick(' ');
                                    else if (key === 'return') handleSave();
                                    else if (key !== 'shift' && key !== '123') handleKeyClick(key);
                                }}
                                className={`kb-key ${key === 'space' ? 'kb-space' : ''} ${key === 'shift' || key === 'backspace' || key === '123' || key === 'return' ? 'kb-special' : ''}`}
                            >
                                {key === 'backspace' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 4H8L1 12L8 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4Z" />
                                        <line x1="18" y1="9" x2="12" y2="15" />
                                        <line x1="12" y1="9" x2="18" y2="15" />
                                    </svg>
                                ) : key === 'shift' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L4 10H8V18H16V10H20L12 2Z" />
                                    </svg>
                                ) : key === 'space' ? 'SPACE' : key}
                            </button>
                        ))}
                    </div>
                ))}

                <div className="kb-bottom-row">
                    <div className="kb-bottom-icons">
                        <button className="kb-extra-btn">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="9.5" cy="9" r="1.2" fill="currentColor" stroke="none" />
                                <circle cx="14.5" cy="9" r="1.2" fill="currentColor" stroke="none" />
                                <path d="M7 13c0 4 10 4 10 0H7z" fill="currentColor" stroke="none" />
                                <path d="M7 13c0 1 10 1 10 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button className="kb-extra-btn">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        </button>
                    </div>
                    <div className="kb-home-bar-actual"></div>
                </div>
            </div>
        </div>
    );
}

export default SetNewPassword;
