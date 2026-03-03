import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { initiateRegistration, forgotPassword } from '../api/auth';


function Verification() {
    const navigate = useNavigate();
    const location = useLocation();
    const { firstName, lastName, email, phone, identifier, isPasswordReset } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        try {
            if (isPasswordReset) {
                await forgotPassword({ identifier });
            } else {
                await initiateRegistration({
                    firstName,
                    lastName,
                    email: email || undefined,
                    phoneNumber: phone
                });
            }
            alert('OTP resent successfully!');
            setOtp(['', '', '', '', '']);
        } catch (error: any) {
            console.error('Resend failed:', error);
            alert('Failed to resend OTP: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsResending(false);
        }
    };


    // Custom Keypad Logic
    const handleKeyClick = (val: string) => {
        const nextIndex = otp.findIndex(digit => digit === '');
        if (nextIndex !== -1) {
            const newOtp = [...otp];
            newOtp[nextIndex] = val;
            setOtp(newOtp);
        }
    };

    const handleDelete = () => {
        // Find last non-empty index
        const lastIndex = [...otp].reverse().findIndex(digit => digit !== '');
        if (lastIndex !== -1) {
            const actualIndex = otp.length - 1 - lastIndex;
            const newOtp = [...otp];
            newOtp[actualIndex] = '';
            setOtp(newOtp);
        }
    };

    const handleVerify = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const otpCode = otp.join('');
            navigate('/set-password', {
                state: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    otp: otpCode,
                    identifier,
                    isPasswordReset
                }
            });
        }, 1000);
    };



    const keys = [
        { val: '1', sub: '' }, { val: '2', sub: 'ABC' }, { val: '3', sub: 'DEF' },
        { val: '4', sub: 'GHI' }, { val: '5', sub: 'JKL' }, { val: '6', sub: 'MNO' },
        { val: '7', sub: 'PQRS' }, { val: '8', sub: 'TUV' }, { val: '9', sub: 'WXYZ' },
        { val: '.', sub: '' }, { val: '0', sub: '' }, { val: 'delete', sub: '' }
    ];

    return (
        <div className="verification-page no-scroll">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
            </header>

            <div className="verification-content-actual">
                <div className="title-section">
                    <h1>Phone verification</h1>
                    <p className="subtitle">Enter your OTP code</p>
                </div>

                <div className="otp-container">
                    {otp.map((digit, idx) => (
                        <div key={idx} className={`otp-input-mock ${digit ? 'filled' : ''}`}>
                            {digit}
                        </div>
                    ))}
                </div>

                <div className="resend-section">
                    <p>
                        Didn't receive code?{' '}
                        <span
                            className={`resend-link-actual ${isResending ? 'disabled' : ''}`}
                            onClick={!isResending ? handleResend : undefined}
                        >
                            {isResending ? 'Resending...' : 'Resend again'}
                        </span>
                    </p>
                </div>

                <button
                    className="btn-create-account"
                    onClick={handleVerify}
                    disabled={isLoading || otp.join('').length < 5}
                >
                    {isLoading ? "Verifying..." : "Verify"}
                </button>
            </div>

            <div className="custom-keyboard">
                {keys.map((key, index) => (
                    <button
                        key={index}
                        className={`key-btn ${key.val === 'delete' ? 'delete-btn' : ''}`}
                        onClick={() => key.val === 'delete' ? handleDelete() : handleKeyClick(key.val)}
                    >
                        {key.val === 'delete' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 4H8L1 12L8 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4Z" />
                                <line x1="18" y1="9" x2="12" y2="15" />
                                <line x1="12" y1="9" x2="18" y2="15" />
                            </svg>
                        ) : (
                            <>
                                <span className="key-val">{key.val}</span>
                                {key.sub && <span className="key-sub">{key.sub}</span>}
                            </>
                        )}
                    </button>
                ))}
            </div>
        </div>

    );
}

export default Verification;
