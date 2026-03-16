import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV_MAP = {
  auth: {
    home: '/auth/pages/Login',
    jobs: '/jobseeker/pages/JobSearch',
    login: '/auth/pages/Login',
    signup: '/auth/pages/Register',
    register: '/auth/pages/Register',
    'post a job': '/employer/pages/PostJob',
  },
  jobseeker: {
    dashboard: '/jobseeker/pages/Dashboard',
    jobs: '/jobseeker/pages/JobSearch',
    'job search': '/jobseeker/pages/JobSearch',
    applications: '/jobseeker/pages/Applications',
    profile: '/jobseeker/pages/Profile',
    logout: '/auth/pages/Login',
  },
  employer: {
    dashboard: '/employer/pages/Dashboard',
    jobs: '/employer/pages/PostJob',
    'job management': '/employer/pages/PostJob',
    candidates: '/employer/pages/Candidates',
    'company profile': '/employer/pages/CompanyProfile',
    profile: '/employer/pages/CompanyProfile',
    logout: '/auth/pages/Login',
  },
  admin: {
    dashboard: '/admin/pages/Dashboard',
    users: '/admin/pages/UserManagement',
    jobs: '/admin/pages/JobManagement',
    analytics: '/admin/pages/SystemLogs',
    companies: '/admin/pages/CompanyManagement',
    logs: '/admin/pages/SystemLogs',
  },
};

const injectPrototypeScript = (rawHtml, moduleKey) => {
  if (!rawHtml) {
    return '';
  }

  const routeMap = NAV_MAP[moduleKey] || {};
  const serializedMap = JSON.stringify(routeMap);
  const bridgeScript = `
<script>
  (function () {
    var routeMap = ${serializedMap};
    var normalize = function (value) {
      return String(value || '').replace(/\\s+/g, ' ').trim().toLowerCase();
    };

    var bindNav = function (node) {
      var label = normalize(node.textContent);
      var target = routeMap[label];
      if (!target) {
        return;
      }

      node.style.cursor = 'pointer';
      node.addEventListener('click', function (event) {
        event.preventDefault();
        window.parent.postMessage({ type: 'stitch-nav', path: target }, '*');
      });

      if (node.tagName === 'A') {
        node.setAttribute('href', target);
      }
    };

    var nodes = document.querySelectorAll('a, button');
    nodes.forEach(bindNav);
  })();
</script>
`;

  if (rawHtml.includes('</body>')) {
    return rawHtml.replace('</body>', `${bridgeScript}</body>`);
  }

  return `${rawHtml}${bridgeScript}`;
};

const HtmlPage = ({ html, title, moduleKey }) => {
  const navigate = useNavigate();
  const srcDocHtml = useMemo(() => injectPrototypeScript(html, moduleKey), [html, moduleKey]);

  useEffect(() => {
    const onMessage = (event) => {
      if (!event?.data || event.data.type !== 'stitch-nav' || !event.data.path) {
        return;
      }
      navigate(event.data.path);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate]);

  return (
    <iframe
      title={title}
      srcDoc={srcDocHtml}
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        display: 'block',
      }}
    />
  );
};

export default HtmlPage;
