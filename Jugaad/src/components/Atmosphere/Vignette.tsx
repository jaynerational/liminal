
const Vignette = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 40,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(253, 249, 246, 0.3) 70%, rgba(253, 249, 246, 0.7) 100%)'
        }} />
    );
};

export default Vignette;
