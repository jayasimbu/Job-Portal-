import React, { useMemo, useState } from 'react';

const tabBtn = (active) => ({
  padding: '8px 12px',
  borderRadius: '999px',
  border: active ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
  background: active ? '#dbeafe' : '#fff',
  color: active ? '#1d4ed8' : '#334155',
  fontWeight: 700,
  fontSize: '12px',
  cursor: 'pointer',
});

const LegacyFeatureTabs = ({ title, subtitle, sections }) => {
  const [active, setActive] = useState(sections?.[0]?.key || '');

  const activeSection = useMemo(() => sections.find((s) => s.key === active) || sections[0], [sections, active]);

  if (!sections?.length) {
    return null;
  }

  return (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '4px' }}>{title}</h3>
      {subtitle ? <p style={{ color: '#64748b', marginBottom: '12px' }}>{subtitle}</p> : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {sections.map((section) => (
          <button key={section.key} type="button" onClick={() => setActive(section.key)} style={tabBtn(section.key === active)}>
            {section.label}
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <p style={{ color: '#334155', marginBottom: '8px' }}>{activeSection.description}</p>
        <ul style={{ lineHeight: 1.8, color: '#475569' }}>
          {(activeSection.items || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LegacyFeatureTabs;
