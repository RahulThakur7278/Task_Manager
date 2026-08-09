const MiniStatCard = ({ label, value, icon: Icon, color, bg, index = 0 }) => {
  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--border-color)',
    boxShadow: '0 2px 8px var(--shadow-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    animationDelay: `${index * 0.08}s`,
  };

  return (
    <div
      className="animate-fade-in-up hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={cardStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: '24px', height: '24px', color }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {value}
          </p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniStatCard;
