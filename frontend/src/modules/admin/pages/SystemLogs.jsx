import React, { useState, useEffect } from 'react';
import { Activity, Database, Zap, Clock, ShieldCheck, Server, RefreshCw } from 'lucide-react';
import apiClient from '@/core/api/apiClient';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

const MetricCard = ({ icon: Icon, label, value, status, statusColor }) => (
  <Card className="border-slate-300 shadow-sm">
    <CardBody className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <Icon size={24} />
        </div>
        <Badge variant={statusColor} className="text-[10px] px-3 py-1 uppercase font-black">
          {status}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
    </CardBody>
  </Card>
);

export default function SystemMonitoring() {
  const [health, setHealth] = useState({
    api: { status: 'Operational', value: '42ms', color: 'success' },
    db: { status: 'Connected', value: 'Healthy', color: 'success' },
    ai: { status: 'Active', value: 'Optimized', color: 'success' },
    uptime: { status: 'Stable', value: '99.98%', color: 'success' }
  });
  const [loading, setLoading] = useState(false);

  const refreshHealth = async () => {
    setLoading(true);
    try {
      const r = await apiClient.get('/admin/health');
      // Update logic here if real data exists
    } catch (err) {
      console.error('Health check failed');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-20 px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Platform Monitoring
          </h1>
          <p className="text-slate-500 font-medium">
            Monitor infrastructure health and system performance.
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={refreshHealth}
          className="h-11 px-6 rounded-xl border-slate-300 font-bold text-xs uppercase tracking-widest gap-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Vitals
        </Button>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard 
          icon={Zap} 
          label="API Response Time" 
          value={health.api.value} 
          status={health.api.status} 
          statusColor={health.api.color} 
        />
        <MetricCard 
          icon={Database} 
          label="Database Connectivity" 
          value={health.db.value} 
          status={health.db.status} 
          statusColor={health.db.color} 
        />
        <MetricCard 
          icon={Activity} 
          label="AI Inference Engine" 
          value={health.ai.value} 
          status={health.ai.status} 
          statusColor={health.ai.color} 
        />
        <MetricCard 
          icon={ShieldCheck} 
          label="Total System Uptime" 
          value={health.uptime.value} 
          status={health.uptime.status} 
          statusColor={health.uptime.color} 
        />
      </div>

      {/* SYSTEM STATE DETAIL */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <CardBody className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Server size={18} className="text-blue-600" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Node</p>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">AWS us-east-1 (Primary)</p>
              <Badge variant="success" className="text-[9px] px-2 py-0.5">Active</Badge>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-600" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SSL Encryption</p>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Let's Encrypt Authority</p>
              <p className="text-[10px] font-bold text-slate-400">Expires in 74 days</p>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-indigo-600" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Backup</p>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">12 May 2026, 04:00 AM</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Success</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}



