import React from 'react';
import { Link } from 'react-router-dom';

const wrap = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  padding: '20px',
};

const card = {
  width: '100%',
  maxWidth: '430px',
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '24px',
};

const input = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '6px',
};

const Login = () => {
  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={{ fontSize: '28px', marginBottom: '6px' }}>Job Portal Authentication</h1>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>Sign in to continue.</p>

        <div style={{ marginBottom: '12px' }}>
          <label>Email</label>
          <input type="email" placeholder="name@company.com" style={input} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Password</label>
          <input type="password" placeholder="********" style={input} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
          Sign In
        </button>

        <p style={{ color: '#64748b', fontSize: '14px' }}>
          New user?{' '}
          <Link to="/auth/pages/Register" style={{ color: '#1d4ed8', fontWeight: 700 }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
