interface HomeIndicatorProps {
    dark?: boolean;
}

const HomeIndicator = ({ dark = false }: HomeIndicatorProps) => {
    return (
        <div style={{
            width: '393px',
            height: '31px', // 21px top + 5px height + 5px bottom?
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
        }}>
            <div style={{
                width: '134px',
                height: '5px',
                background: dark ? '#141414' : '#FFFFFF',
                borderRadius: '100px',
                opacity: 1,
                position: 'absolute',
                top: '21px',
                left: '130px'
            }} />
        </div>
    );
};

export default HomeIndicator;
