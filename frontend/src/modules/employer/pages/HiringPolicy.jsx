import React, { useEffect, useState } from 'react';
import EmployerShell from '../components/EmployerShell';
import { fetchHiringPolicy, saveHiringPolicy } from '../services/employerService';

const HiringPolicy = () => {
  const [policy, setPolicy] = useState({
    skill_only_evaluation: true,
    hide_sensitive_attributes: true,
    bias_monitoring_enabled: true,
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchHiringPolicy(1);
        if (response?.policy) {
          setPolicy(response.policy);
        }
      } catch {
        setPolicy((prev) => prev);
      }
    };
    load();
  }, []);

  const onSave = async () => {
    const response = await saveHiringPolicy({ employer_id: 1, ...policy });
    if (response?.policy) {
      setPolicy(response.policy);
      setStatus('Policy configuration saved');
    }
  };

  return (
    <EmployerShell active="policy">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Hiring Policy</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Policy controls migrated from the legacy bias-free configuration module.</p>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'grid', gap: '10px', color: '#334155' }}>
          <label>
            <input type="checkbox" checked={policy.skill_only_evaluation} onChange={(e) => setPolicy((p) => ({ ...p, skill_only_evaluation: e.target.checked }))} /> Skill-only candidate evaluation
          </label>
          <label>
            <input type="checkbox" checked={policy.hide_sensitive_attributes} onChange={(e) => setPolicy((p) => ({ ...p, hide_sensitive_attributes: e.target.checked }))} /> Hide sensitive attributes
          </label>
          <label>
            <input type="checkbox" checked={policy.bias_monitoring_enabled} onChange={(e) => setPolicy((p) => ({ ...p, bias_monitoring_enabled: e.target.checked }))} /> Bias monitoring enabled
          </label>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={onSave}>
          Save Policy Configuration
        </button>
        {status ? <p style={{ marginTop: '10px', color: '#0f766e', fontWeight: 600 }}>{status}</p> : null}
      </div>
    </EmployerShell>
  );
};

export default HiringPolicy;
