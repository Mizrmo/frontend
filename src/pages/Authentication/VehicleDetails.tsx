import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './VehicleDetails.css';

function VehicleDetails() {
    const navigate = useNavigate();
    const [gender, setGender] = useState('Male');
    const [dob, setDob] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [licenceNumber, setLicenceNumber] = useState('');
    const [dateIssued, setDateIssued] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [ghanaCardNumber, setGhanaCardNumber] = useState('');
    const [organisationType, setOrganisationType] = useState('');
    const [otherOrganisation, setOtherOrganisation] = useState('');
    const [showRelationalInfo, setShowRelationalInfo] = useState(false);

    // File Upload Refs
    const licenceFrontRef = useRef<HTMLInputElement>(null);
    const licenceBackRef = useRef<HTMLInputElement>(null);
    const ghanaFrontRef = useRef<HTMLInputElement>(null);
    const ghanaBackRef = useRef<HTMLInputElement>(null);

    // File States
    const [licenceFront, setLicenceFront] = useState<File | null>(null);
    const [licenceBack, setLicenceBack] = useState<File | null>(null);
    const [ghanaFront, setGhanaFront] = useState<File | null>(null);
    const [ghanaBack, setGhanaBack] = useState<File | null>(null);

    const handleRegister = () => {
        navigate('/enable-location');
    };

    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };
    return (
        <div className="vehicle-details-page">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <header className="page-header">
                <button className="nav-btn back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="page-title">Driver Details</h1>
                <div className="nav-spacer" />
            </header>

            <div className="vehicle-details-scroll-container">
                <div className="vehicle-details-content">
                    <div className="driver-form">
                        <div className="form-group gap-3">
                            <label className="form-label">Date Of Birth<span className="required">*</span></label>
                            <div
                                className="picker-input-field"
                                style={{ position: 'relative' }}
                                onClick={(e) => {
                                    const input = (e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement);
                                    if (input) {
                                        if ('showPicker' in HTMLInputElement.prototype) {
                                            try {
                                                input.showPicker();
                                            } catch (err) {
                                                input.click();
                                            }
                                        } else {
                                            input.click();
                                        }
                                    }
                                }}
                            >
                                <span className={`picker-placeholder ${dob ? 'has-value' : ''}`}>{dob ? formatDateForDisplay(dob) : 'Date of Birth'}</span>
                                <input
                                    type="date"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 1 }}
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                                <div className="picker-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="4" width="18" height="18" rx="3" fill="#D0D0D0" />
                                        <rect x="7" y="2" width="2" height="4" rx="1" fill="#D0D0D0" />
                                        <rect x="15" y="2" width="2" height="4" rx="1" fill="#D0D0D0" />
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
                        </div>

                        <div className="form-group gap-10">
                            <label className="form-label">Emergency Contact<span className="required">*</span></label>
                            <input
                                type="text"
                                placeholder="Emergency Contact"
                                value={emergencyContact}
                                onChange={(e) => setEmergencyContact(e.target.value)}
                            />
                        </div>

                        <div className="form-group gap-10" style={{ marginTop: '8px', marginBottom: '8px' }}>
                            <div className="label-with-info">
                                <label className="form-label">Relational Organisation</label>
                                <div className="info-icon-wrapper" onClick={() => setShowRelationalInfo(!showRelationalInfo)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0052B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 16V12" stroke="#0052B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 8H12.01" stroke="#0052B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="select-dropdown-wrapper">
                                <select
                                    className="select-field"
                                    value={organisationType}
                                    onChange={(e) => setOrganisationType(e.target.value)}
                                >
                                    <option value="" disabled>Select Organisation Type</option>
                                    <option value="Workplace">Workplace</option>
                                    <option value="School">School</option>
                                    <option value="Church">Church</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="select-chevron">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {organisationType === 'Other' && (
                                <input
                                    type="text"
                                    placeholder="Specify other organisation"
                                    value={otherOrganisation}
                                    onChange={(e) => setOtherOrganisation(e.target.value)}
                                    className="specify-other-input"
                                />
                            )}
                            {showRelationalInfo && (
                                <div className="info-tooltip-box">
                                    “Add your relational organisation(workplace, school, or church) you want to be primarily identified with. This helps you find more trusted rides with people you already share a connection with.”
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Gender</label>
                            <div className="gender-group">
                                {['Male', 'Female', 'Other'].map((option) => (
                                    <div key={option} className={`radio-item ${gender === option ? 'active' : ''}`} onClick={() => setGender(option)}>
                                        <div className="radio-circle">
                                            <div className="radio-inner" />
                                        </div>
                                        <span className="radio-label">{option}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="licence-section-frame">
                            <div className="form-group gap-3">
                                <label className="form-label">Driver’s Licence<span className="required">*</span></label>
                                <div className="picker-input-field">
                                    <input
                                        type="text"
                                        className="picker-placeholder"
                                        placeholder="Driver’s Licence Number"
                                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', color: '#1A1A1A' }}
                                        value={licenceNumber}
                                        onChange={(e) => setLicenceNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group width-173 gap-3">
                                    <label className="form-label">Date Issued<span className="required">*</span></label>
                                    <div
                                        className="picker-input-field width-173"
                                        style={{ position: 'relative' }}
                                        onClick={(e) => {
                                            const input = (e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement);
                                            if (input) {
                                                if ('showPicker' in HTMLInputElement.prototype) {
                                                    try {
                                                        input.showPicker();
                                                    } catch (err) {
                                                        input.click();
                                                    }
                                                } else {
                                                    input.click();
                                                }
                                            }
                                        }}
                                    >
                                        <span className={`picker-placeholder ${dateIssued ? 'has-value' : ''}`}>{dateIssued ? formatDateForDisplay(dateIssued) : 'Date Issued'}</span>
                                        <input
                                            type="date"
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 1 }}
                                            value={dateIssued}
                                            onChange={(e) => setDateIssued(e.target.value)}
                                        />
                                        <div className="picker-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="4" width="18" height="18" rx="3" fill="#D0D0D0" />
                                                <rect x="7" y="2" width="2" height="4" rx="1" fill="#D0D0D0" />
                                                <rect x="15" y="2" width="2" height="4" rx="1" fill="#D0D0D0" />
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
                                </div>
                                <div className="form-group width-173 gap-3">
                                    <label className="form-label">Expiry Date<span className="required">*</span></label>
                                    <div
                                        className="picker-input-field width-173"
                                        style={{ position: 'relative' }}
                                        onClick={(e) => {
                                            const input = (e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement);
                                            if (input) {
                                                if ('showPicker' in HTMLInputElement.prototype) {
                                                    try {
                                                        input.showPicker();
                                                    } catch (err) {
                                                        input.click();
                                                    }
                                                } else {
                                                    input.click();
                                                }
                                            }
                                        }}
                                    >
                                        <span className={`picker-placeholder ${expiryDate ? 'has-value' : ''}`}>{expiryDate ? formatDateForDisplay(expiryDate) : 'Expiry Date'}</span>
                                        <input
                                            type="date"
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 1 }}
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                        />
                                        <div className="picker-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="4" width="18" height="18" rx="3" fill="#D0D0D0" />
                                                <rect x="7" y="2" width="2" height="4" rx="1" fill="#D0D0D0" />
                                                <rect x="15" y="2" width="2" height="4" rx="1" fill="#D0D0D0" />
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
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Front Side of Card<span className="required">*</span></label>
                                <div className="upload-container" onClick={() => licenceFrontRef.current?.click()}>
                                    <input type="file" ref={licenceFrontRef} style={{ display: 'none' }} onChange={(e) => setLicenceFront(e.target.files?.[0] || null)} />
                                    <div className="upload-icon-circle">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                                            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                            <path d="M21 14l-5-4-6 6-3-3-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="18" cy="6" r="5" fill="currentColor" stroke="#F0F5FF" strokeWidth="1.5" />
                                            <path d="M18 4v4M16 6h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <span className="upload-text">{licenceFront ? licenceFront.name : 'Click to Upload Front Side of Card'}</span>
                                    <span className="upload-hint">(Max. File size: 25 MB)</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Back Side of Card<span className="required">*</span></label>
                                <div className="upload-container" onClick={() => licenceBackRef.current?.click()}>
                                    <input type="file" ref={licenceBackRef} style={{ display: 'none' }} onChange={(e) => setLicenceBack(e.target.files?.[0] || null)} />
                                    <div className="upload-icon-circle">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                                            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                            <path d="M21 14l-5-4-6 6-3-3-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="18" cy="6" r="5" fill="currentColor" stroke="#F0F5FF" strokeWidth="1.5" />
                                            <path d="M18 4v4M16 6h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <span className="upload-text">{licenceBack ? licenceBack.name : 'Click to Upload Back Side of Card'}</span>
                                    <span className="upload-hint">(Max. File size: 25 MB)</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-with-icon" style={{ marginTop: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter Ghana Card Number"
                                    style={{ borderRadius: '24px' }}
                                    value={ghanaCardNumber}
                                    onChange={(e) => setGhanaCardNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Front Side of Card<span className="required">*</span></label>
                            <div className="upload-container" onClick={() => ghanaFrontRef.current?.click()}>
                                <input type="file" ref={ghanaFrontRef} style={{ display: 'none' }} onChange={(e) => setGhanaFront(e.target.files?.[0] || null)} />
                                <div className="upload-icon-circle">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                                        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                        <path d="M21 14l-5-4-6 6-3-3-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="18" cy="6" r="5" fill="currentColor" stroke="#F0F5FF" strokeWidth="1.5" />
                                        <path d="M18 4v4M16 6h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <span className="upload-text">{ghanaFront ? ghanaFront.name : 'Click to Upload Front Side of Card'}</span>
                                <span className="upload-hint">(Max. File size: 25 MB)</span>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '40px' }}>
                            <label className="form-label">Back Side of Card<span className="required">*</span></label>
                            <div className="upload-container" onClick={() => ghanaBackRef.current?.click()}>
                                <input type="file" ref={ghanaBackRef} style={{ display: 'none' }} onChange={(e) => setGhanaBack(e.target.files?.[0] || null)} />
                                <div className="upload-icon-circle">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                                        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                        <path d="M21 14l-5-4-6 6-3-3-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="18" cy="6" r="5" fill="currentColor" stroke="#F0F5FF" strokeWidth="1.5" />
                                        <path d="M18 4v4M16 6h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <span className="upload-text">{ghanaBack ? ghanaBack.name : 'Click to Upload Back Side of Card'}</span>
                                <span className="upload-hint">(Max. File size: 25 MB)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-footer">
                <button className="btn-register" onClick={handleRegister}>Register</button>
                <div style={{ marginTop: '8px' }}>
                    <HomeIndicator dark />
                </div>
            </div>
        </div>
    );
}

export default VehicleDetails;
