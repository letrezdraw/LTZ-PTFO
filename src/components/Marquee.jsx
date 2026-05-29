export const Marquee = ({ text, direction = 'left', speed = 'slow' }) => {
  const speedMap = {
    slow: '60s',
    medium: '40s',
    fast: '20s'
  };

  const animationName = direction === 'left' ? 'marquee' : 'marquee-reverse';

  return (
    <div
      style={{
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0',
        position: 'relative'
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
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}
      >
        <div style={{ display: 'flex', gap: '0' }}>
          {text} &nbsp;&nbsp;
          {text}
        </div>
      </div>
    </div>
  );
};
