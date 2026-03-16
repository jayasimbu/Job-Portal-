import React from 'react';

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <section className="card" style={{ maxWidth: '480px', margin: '20px auto' }}>
      <h2>{title}</h2>
      {subtitle ? <p style={{ color: '#666' }}>{subtitle}</p> : null}
      <div style={{ marginTop: '16px' }}>{children}</div>
    </section>
  );
};

export default AuthCard;
