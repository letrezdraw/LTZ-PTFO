export const MarqueeMobile = ({ text, direction = 'left', speed = 'slow' }) => {
  const speedMap = {
    slow: '40s',
    medium: '25s',
    fast: '15s'
  };

  const animationName = direction === 'left' ? 'marquee' : 'marquee-reverse';

  return (
    <div
      style={{
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 0',
        position: 'relative',
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0',
          whiteSpace: 'nowrap',
          animation: `${animationName} ${speedMap[speed]} linear infinite`,
          color: 'var(--accent-red)',
          fontSize: '15px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontWeight: 500
        }}
      >
        <div style={{ display: 'flex', gap: '0' }}>
          {text} &nbsp;&nbsp;&nbsp;&nbsp;
          {text}
        </div>
      </div>
    </div>
  );
};
