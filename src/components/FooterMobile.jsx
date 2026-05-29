export const FooterMobile = () => {
  return (
    <footer
      style={{
        padding: '24px 16px',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '12px',
          letterSpacing: '0.5px'
        }}
      >
        © 2024 LETREZDRAW · ALL RIGHTS RESERVED
      </div>
      
      <div
        style={{
          fontSize: '22px',
          color: 'var(--text-secondary)',
          marginTop: '8px',
          letterSpacing: '0.5px'
        }}
      >
        OPTIMIZED FOR MOBILE · PORTFOLIO V1.0
      </div>
    </footer>
  );
};
