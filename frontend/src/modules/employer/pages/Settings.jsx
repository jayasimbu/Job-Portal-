import React from 'react';
import { 
  Building2, 
  Target, 
  Bell, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  Globe,
  Mail,
  Lock
} from 'lucide-react';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';

const SettingItem = ({ icon: Icon, title, description, action }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{title}</h4>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
  </div>
);

const SectionHeader = ({ title }) => (
  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{title}</h3>
);

export default function Settings() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-16 px-6">
      {/* HEADER */}
      <div className="pt-4 space-y-0.5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Settings
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Manage your company profile, hiring preferences, and team access.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* COMPANY PROFILE */}
        <div className="space-y-4">
          <SectionHeader title="Organization" />
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <SettingItem 
              icon={Building2} 
              title="Company Profile" 
              description="Logo, description, website, and industry details."
            />
            <SettingItem 
              icon={Globe} 
              title="Public Presence" 
              description="Manage how your company appears to candidates."
            />
          </Card>
        </div>

        {/* HIRING PREFERENCES */}
        <div className="space-y-4">
          <SectionHeader title="Recruitment" />
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <SettingItem 
              icon={Target} 
              title="Hiring Preferences" 
              description="Default job templates, match thresholds, and skill priorities."
            />
            <SettingItem 
              icon={Bell} 
              title="Notifications" 
              description="Alerts for new applicants, interviews, and status updates."
            />
          </Card>
        </div>

        {/* ACCESS & SECURITY */}
        <div className="space-y-4">
          <SectionHeader title="Access & Security" />
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <SettingItem 
              icon={Users} 
              title="Team Access" 
              description="Invite recruiters, hiring managers, and manage permissions."
            />
            <SettingItem 
              icon={ShieldCheck} 
              title="Security" 
              description="Two-factor authentication, session management, and login history."
            />
            <SettingItem 
              icon={Lock} 
              title="Privacy" 
              description="Data handling preferences and candidate privacy settings."
            />
          </Card>
        </div>
        
        {/* DANGER ZONE */}
        <div className="pt-4">
          <Button variant="ghost" className="text-rose-500 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest px-6">
            Archive Account
          </Button>
        </div>
      </div>
    </div>
  );
}
