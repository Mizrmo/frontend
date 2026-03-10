interface HomeIndicatorProps {
    dark?: boolean;
}

const HomeIndicator = ({ dark = false }: HomeIndicatorProps) => {
    return (
        <div style={{
            width: '100%',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            <div style={{
                width: '134px',
                height: '5px',
                background: dark ? '#1A1A1A' : '#FFFFFF',
                borderRadius: '3px',
                opacity: dark ? 0.2 : 0.4,
            }} />
        </div>
    );
};

export default HomeIndicator;
