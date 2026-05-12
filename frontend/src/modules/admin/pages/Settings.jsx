import React from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  User,
  ChevronRight,
  Globe,
  Database,
  Lock,
  Cpu,
  Mail,
  Zap,
  ShieldCheck,
  RefreshCw,
  Power,
  Server,
  ArrowRight
} from 'lucide-react';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

const Settings = () => {
  const sections = [
    { title: 'Infrastructure', desc: 'Manage server environments, API endpoints, and global system scaling.', icon: Database, tag: 'Core' },
    { title: 'Security', desc: 'Configure authentication protocols, encryption keys, and session management.', icon: Lock, tag: 'Security' },
    { title: 'Automations', desc: 'Manage system webhooks, event triggers, and automated workflows.', icon: Zap, tag: 'Logic' },
    { title: 'Access Control', desc: 'Define administrative roles and platform-wide permission matrix.', icon: Shield, tag: 'IAM' },
    { title: 'Intelligence', desc: 'Configure AI models, matching thresholds, and inference parameters.', icon: Cpu, tag: 'AI' },
    { title: 'Messaging', desc: 'Manage SMTP relay settings and platform notification providers.', icon: Mail, tag: 'Communication' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-20 px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Platform Settings
          </h1>
          <p className="text-slate-500 font-medium">
            Manage system configurations and administrative controls.
          </p>
        </div>
      </div>

      {/* SETTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <Card key={i} className="border-slate-200 shadow-sm hover:border-blue-500/50 transition-colors group cursor-pointer">
            <CardBody className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                  <section.icon size={24} />
                </div>
                <Badge variant="secondary" className="text-[9px] px-2 py-0.5 uppercase font-black">
                  {section.tag}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{section.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{section.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Configure</span>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* CRITICAL ACTIONS */}
      <Card className="border-slate-900 bg-slate-900 dark:bg-slate-950 overflow-hidden shadow-xl">
        <CardBody className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">System Integrity Verified</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Infrastructure Control</h3>
            <p className="text-slate-400 text-sm font-medium max-w-md">Critical system modifications require multi-factor authentication and are logged in the audit registry.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="white" className="h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest gap-2">
              <Database size={16} />
              Export Backup
            </Button>
            <Button variant="danger" className="h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest gap-2 border-transparent">
              <Power size={16} />
              System Lockdown
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;



