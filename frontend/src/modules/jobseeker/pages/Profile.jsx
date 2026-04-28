import React, { useEffect, useMemo, useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import { fetchJobSeekerProfile, upsertJobSeekerProfile, fetchJobSeekerCertificates, uploadCertificate } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '18px',
  color: 'var(--text-main)',
};

const tag = {
  display: 'inline-block',
  background: 'rgba(37, 99, 235, 0.1)',
  color: 'var(--text-main)',
  borderRadius: '999px',
  padding: '4px 10px',
  fontSize: '12px',
  marginRight: '6px',
  marginBottom: '6px',
  fontWeight: 700,
  border: '1px solid rgba(37, 99, 235, 0.1)',
};

const Profile = () => {
  const userId = useMemo(() => getCurrentUserId(1), []);
  const [form, setForm] = useState({
    headline: '',
    skills: '',
    experience_years: 0,
    education_level: '',
    portfolio_url: '',
    github_url: '',
  });
  const [status, setStatus] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const topCertificate = useMemo(() => {
    if (!certificates || certificates.length === 0) return null;
    return certificates.reduce((prev, current) => 
      (prev.confidence_score > current.confidence_score) ? prev : current
    );
  }, [certificates]);

  const loadData = async () => {
    try {
      const response = await fetchJobSeekerProfile(userId);
      const profile = response?.profile;
      
      try {
        const certsRes = await fetchJobSeekerCertificates();
        if (certsRes?.certificates) setCertificates(certsRes.certificates);
      } catch (err) {
        console.error("No certs found");
      }

      if (!profile) return;
      
      setForm({
        headline: profile.headline || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        experience_years: profile.experience_years || 0,
        education_level: profile.education_level || '',
        portfolio_url: profile.portfolio_url || '',
        github_url: profile.github_url || '',
      });
    } catch {
      setStatus('Unable to load profile now.');
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSave = async () => {
    try {
      setStatus('');
      await upsertJobSeekerProfile(userId, {
        headline: form.headline,
        skills: form.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        experience_years: Number(form.experience_years) || 0,
        education_level: form.education_level,
        portfolio_url: form.portfolio_url,
        github_url: form.github_url,
      });
      setStatus('Profile saved successfully.');
    } catch {
      setStatus('Failed to save profile.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadError('');
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("File exceeds 5MB limit");
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) throw new Error("Only PDF, JPG, PNG allowed");
      
      await uploadCertificate(file);
      await loadData();
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || "Failed to upload certificate");
    } finally {
      setUploading(false);
      e.target.value = null; // reset
    }
  };

  return (
    <JobSeekerShell active="profile">
      <h1 style={{ fontSize: '34px', marginBottom: '6px', color: 'var(--text-main)' }}>Profile Setup</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '18px' }}>Keep your profile complete to improve AI ranking and recommendations.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        <section style={card}>
          <h3 style={{ marginBottom: '10px' }}>Personal Details</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input placeholder="Professional headline" className="form-control" style={input} value={form.headline} onChange={(e) => onChange('headline', e.target.value)} />
            <input placeholder="Skills (comma separated)" className="form-control" style={input} value={form.skills} onChange={(e) => onChange('skills', e.target.value)} />
            <input type="number" placeholder="Years of experience" className="form-control" style={input} value={form.experience_years} onChange={(e) => onChange('experience_years', e.target.value)} />
            <input placeholder="Education level" className="form-control" style={input} value={form.education_level} onChange={(e) => onChange('education_level', e.target.value)} />
          </div>

          <h3 style={{ margin: '18px 0 10px' }}>Links</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input placeholder="GitHub URL" style={input} value={form.github_url} onChange={(e) => onChange('github_url', e.target.value)} />
            <input placeholder="Portfolio URL" style={input} value={form.portfolio_url} onChange={(e) => onChange('portfolio_url', e.target.value)} />
          </div>

          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={onSave}>
            Save Profile
          </button>
          {status ? <p style={{ marginTop: '10px', color: status.includes('Failed') ? '#b91c1c' : '#0f766e', fontWeight: 600 }}>{status}</p> : null}
        </section>

        <aside style={card}>
          <h3 style={{ marginBottom: '10px' }}>AI Extracted Summary</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Resume parsing progress: 65%</p>
          <div style={{ height: '8px', background: 'var(--border)', borderRadius: '999px', marginBottom: '14px' }}>
            <div style={{ width: '65%', height: '100%', background: '#2563eb', borderRadius: '999px' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Detected Skills</strong>
          </div>
          <div>
            {['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS'].map((s) => (
              <span key={s} style={tag}>
                {s}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '16px', color: '#334155' }}>
            <p style={{ marginBottom: '6px' }}><strong>Experience:</strong> Senior Frontend Engineer, 4 years</p>
            <p><strong>Education:</strong> B.S. Computer Science</p>
          </div>
        </aside>
      </div>

      <div style={{ ...card, marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>My Certificates & Certifications</h3>
              {topCertificate && (
                <div style={{ background: 'linear-gradient(to right, #fbbf24, #f59e0b)', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>emoji_events</span>
                  Top Certification: {topCertificate.issuer} ({topCertificate.confidence_score}%)
                </div>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>AI evaluates and matches verified certificates to boost your ATS ranking score up to 20 points.</p>
          </div>
          <div>
            <label className="btn btn-primary" style={{ cursor: uploading ? 'not-allowed' : 'pointer', background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              {uploading ? 'Processing AI...' : '+ Upload Certificate'}
              <input type="file" style={{ display: 'none' }} accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>
        
        {uploadError && <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>{uploadError}</p>}

        {certificates.length === 0 ? (
          <label style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'block' }}>
            <div style={{ padding: '40px 20px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', background: 'var(--bg-page)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94a3b8' }}>cloud_upload</span>
              <p style={{ fontWeight: 'bold', color: 'var(--text-main)', marginTop: '12px', fontSize: '16px' }}>Drag & Drop Certificate Here</p>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>{uploading ? 'Processing AI Data...' : 'Support for PDF, JPG, PNG up to 5MB'}</p>
              <input type="file" style={{ display: 'none' }} accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} disabled={uploading} />
            </div>
          </label>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {certificates.map(cert => (
              <div key={cert.id} style={{ border: cert.confidence_score < 50 ? '2px solid #ef4444' : '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'var(--bg-page)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#2563eb' }}>workspace_premium</span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cert.certificate_name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{cert.issuer}</p>
                        {cert.tags && cert.tags.map(t => <span key={t} style={{background: '#e0f2fe', color: '#0ea5e9', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'}}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <a href={cert.file_url} target="_blank" rel="noreferrer" style={{ color: '#cbd5e1' }} title="View Document">
                    <span className="material-symbols-outlined">description</span>
                  </a>
                </div>

                <div style={{ background: cert.verification_status === 'rejected' ? '#fef2f2' : cert.verification_status === 'verified' ? '#f0fdf4' : '#eff6ff', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--text-muted)' }}>AI Evaluation</span>
                    <span style={{ color: cert.confidence_level === 'High' ? '#16a34a' : cert.confidence_level === 'Medium' ? '#ca8a04' : '#dc2626' }}>
                      {cert.confidence_level === 'High' ? '🟢' : cert.confidence_level === 'Medium' ? '🟡' : '🔴'} {cert.confidence_level} Confidence ({cert.confidence_score}%)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status</span>
                    {cert.verification_status === 'pending' && <span style={{ color: '#64748b' }}>⏳ Pending</span>}
                    {cert.verification_status === 'ai_reviewed' && <span style={{ color: '#2563eb' }}>🔍 AI Reviewed</span>}
                    {cert.verification_status === 'verified' && <span style={{ color: '#16a34a' }}>✔ Verified</span>}
                    {cert.verification_status === 'rejected' && <span style={{ color: '#dc2626' }}>✖ Rejected</span>}
                  </div>
                  {cert.breakdown && cert.breakdown.length > 0 && (
                     <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px', marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
                        {cert.breakdown.map((b, i) => <p key={i} style={{marginBottom: '2px'}}>{b}</p>)}
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </JobSeekerShell>
  );
};

const input = {
  width: '100%',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '10px 12px',
  fontSize: '14px',
  background: 'var(--bg-page)',
  color: 'var(--text-main)',
  outline: 'none',
};

export default Profile;
