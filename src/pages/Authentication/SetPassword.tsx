import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setPassword, resetPassword } from '../../api/auth';

import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './SetPassword.css';

function SetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    // userId comes from verifyOtp response (for registration)
    // email + isPasswordReset come from forgot-password flow
    const { userId, firstName, email, phoneNumber, isPasswordReset } = location.state || {};

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

    const handleAction = async () => {
        if (!formData.password || !formData.confirmPassword) {
            alert('Please enter and confirm your password');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Validate password complexity per API requirements
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
        if (!pwRegex.test(formData.password)) {
            alert('Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
            return;
        }

        setIsLoading(true);
        try {
            if (isPasswordReset) {
                // For forgot-password flow — handled by SendVerification → Verification → here
                // But reset-password needs email + code + newPassword (code was not passed here)
                // Navigate back cleanly
                alert('Please use the Reset Password flow from the start.');
                navigate('/send-verification');
            } else {
                // Registration flow: use userId from verifyOtp step
                await setPassword({ userId, password: formData.password });
                navigate('/home_screen_Transport');
            }
        } catch (error: any) {
            console.error('Set password failed:', error);
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueAsRider = () => handleAction();
    const handleContinueAsDriver = () => handleAction();


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
                    <h1 className="registration-title">{isPasswordReset ? 'Reset password' : 'Set password'}</h1>
                    <p className="registration-subtitle">{isPasswordReset ? 'Enter your new password' : 'Set your password'}</p>
                </div>

                <div className="mobile-form">
                    <div className={`password-group ${activeField === 'password' ? 'active' : ''}`}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            onFocus={() => setActiveField('password')}
                        />
                        <div className="sv-input-icons">
                            <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
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
                        </div>
                    </div>

                    <div className={`password-group ${activeField === 'confirmPassword' ? 'active' : ''}`}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            onFocus={() => setActiveField('confirmPassword')}
                        />
                        <div className="sv-input-icons">
                            <button className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
                        </div>
                    </div>

                    {isPasswordReset ? (
                        <button className="btn-rider" onClick={() => handleAction()} disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    ) : (
                        <>
                            <button className="btn-rider" onClick={handleContinueAsRider} disabled={isLoading}>
                                {isLoading ? "creating account..." : "Continue As Rider"}
                            </button>

                            <button className="btn-driver" onClick={handleContinueAsDriver} disabled={isLoading}>
                                {isLoading ? "creating account..." : "Continue As Driver"}
                            </button>
                        </>
                    )}
                </div>

            </div>

            {/* Custom Alphanumeric Keyboard (Mock to match vision) */}
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
                                    else if (key === 'return') handleContinueAsDriver();
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

export default SetPassword;
