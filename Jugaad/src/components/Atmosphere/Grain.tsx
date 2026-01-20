
const Grain = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50,
            opacity: 0.04,
            filter: 'contrast(100%) brightness(100%)'
        }}>
            <svg
                viewBox="0 0 200 200"
                xmlns='http://www.w3.org/2000/svg'
                style={{ width: '100%', height: '100%' }}
            >
                <filter id='noiseFilter'>
                    <feTurbulence
                        type='fractalNoise'
                        baseFrequency='0.8'
                        numOctaves='3'
                        stitchTiles='stitch'
                    />
                </filter>
                <rect width='100%' height='100%' filter='url(#noiseFilter)' />
            </svg>
        </div>
    );
};

export default Grain;
