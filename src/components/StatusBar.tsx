interface StatusBarProps {
    dark?: boolean;
}

const StatusBar = ({ dark = false }: StatusBarProps) => {
    const textColor = dark ? '#1A1A1A' : '#FFFFFF';

    return (
        <div style={{
            width: '100%',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'relative',
            zIndex: 100,
            flexShrink: 0,
        }}>
            {/* Time */}
            <span style={{
                fontSize: '15px',
                fontWeight: 600,
                color: textColor,
                fontFamily: 'Inter, sans-serif',
            }}>9:41</span>

            {/* Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Signal */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill={textColor}>
                    <rect x="0" y="6" width="3" height="6" rx="1" />
                    <rect x="4.5" y="4" width="3" height="8" rx="1" />
                    <rect x="9" y="2" width="3" height="10" rx="1" />
                    <rect x="13.5" y="0" width="3" height="12" rx="1" />
                </svg>
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill={textColor}>
                    <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                    <path d="M1.5 5.5C3.5 3.8 5.6 3 8 3s4.5.8 6.5 2.5" stroke={textColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M4 8c1.1-.9 2.4-1.5 4-1.5s2.9.6 4 1.5" stroke={textColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
                {/* Battery */}
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                    <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={textColor} strokeOpacity="0.35" />
                    <rect x="2" y="2" width="16" height="8" rx="2" fill={textColor} />
                    <path d="M23 4v4a2 2 0 0 0 0-4z" fill={textColor} fillOpacity="0.4" />
                </svg>
            </div>
        </div>
    );
};

export default StatusBar;
