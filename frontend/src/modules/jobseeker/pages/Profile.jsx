import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Code, ExternalLink, 
  Settings, Bell, Lock, Eye, Download, UploadCloud, Briefcase, GraduationCap
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [activeTab, setActiveTab] = useState('profile'); // profile | account

  // Mock data representing a complete profile
  const profileData = {
    name: user.full_name || 'Jayasimbu Jayamani',
    role: 'Frontend Developer',
    location: 'Chennai, India',
    email: user.email || 'jayasimbu@example.com',
    phone: '+91 9876543210',
    about: 'Frontend developer passionate about building modern web applications with a focus on performance, accessibility, and clean code architecture. Experienced in React ecosystem and UI/UX design systems.',
    personalDetails: {
      dob: '15 Aug 1999',
      gender: 'Male',
      languages: 'English, Tamil',
      nationality: 'Indian'
    },
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'JavaScript', 'TypeScript', 'Redux', 'Git'],
    experience: [
      { id: 1, role: 'Frontend Developer', company: 'Tech Corp', duration: '2023 - Present', description: 'Leading the frontend team to build scalable React applications.' },
      { id: 2, role: 'Frontend Intern', company: 'ABC Technologies', duration: '2022 - 2023', description: 'Developed interactive UI components using Vue.js.' }
    ],
    education: [
      { id: 1, degree: 'B.Tech IT', institution: 'XYZ College of Engineering', year: '2023', score: '8.5 CGPA' }
    ],
    projects: [
      { id: 1, title: 'E-Commerce Dashboard', tech: ['React', 'Tailwind', 'Redux'], github: '#', live: '#' },
      { id: 2, title: 'AI Resume Builder', tech: ['Next.js', 'OpenAI API', 'MongoDB'], github: '#', live: '#' }
    ],
    certifications: [
      { id: 1, title: 'Meta Front-End Developer', provider: 'Coursera', year: '2023' }
    ]
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20 px-8">
      {/* HEADER & TABS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
          <Button variant="secondary" className="gap-2">
            <Edit2 size={16} /> Edit Profile
          </Button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'account' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Account Settings
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Overview & Personal */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="size-24 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center text-3xl font-black shadow-inner border-4 border-white dark:border-slate-900">
                {profileData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.name}</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">{profileData.role}</p>
              </div>
              <div className="w-full space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-slate-400" /> {profileData.location}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-slate-400" /> {profileData.email}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Phone size={16} className="text-slate-400" /> {profileData.phone}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Personal Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Date of Birth</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{profileData.personalDetails.dob}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Gender</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{profileData.personalDetails.gender}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Languages</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{profileData.personalDetails.languages}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Nationality</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{profileData.personalDetails.nationality}</span>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider">Resume</h3>
              <div className="space-y-3">
                <Button className="w-full justify-center gap-2">
                  <Download size={16} /> Download PDF
                </Button>
                <Button variant="secondary" className="w-full justify-center gap-2 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/50">
                  <UploadCloud size={16} /> Replace Resume
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-blue-600" /> About
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm">
                {profileData.about}
              </p>
            </section>

            {/* Skills */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="size-2 bg-emerald-500 rounded-full" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" /> Experience
              </h3>
              <div className="space-y-6 pl-2 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                {profileData.experience.map(exp => (
                  <div key={exp.id} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[27px] top-1.5 border-4 border-white dark:border-slate-900" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{exp.company} • {exp.duration}</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap size={18} className="text-blue-600" /> Education
              </h3>
              <div className="space-y-6 pl-2 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                {profileData.education.map(edu => (
                  <div key={edu.id} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[27px] top-1.5 border-4 border-white dark:border-slate-900" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{edu.degree}</h4>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{edu.institution} • {edu.year}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{edu.score}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="size-2 bg-purple-500 rounded-full" /> Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.projects.map(proj => (
                  <div key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{proj.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tech.map(t => (
                        <span key={t} className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" className="h-8 px-2 text-xs text-slate-600 hover:bg-white dark:hover:bg-slate-800">
                        <Code size={14} className="mr-1" /> Code
                      </Button>
                      <Button variant="ghost" className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <ExternalLink size={14} className="mr-1" /> Live Demo
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      ) : (
        /* ACCOUNT SETTINGS TAB */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
              <Settings size={20} className="text-slate-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Account Preferences</h3>
              <p className="text-sm font-medium text-slate-500 mb-4">Manage your language, timezone, and general account settings.</p>
              <Button variant="secondary" className="h-9 px-4 text-sm">Manage Preferences</Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="size-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
              <Bell size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Email Notifications</h3>
              <p className="text-sm font-medium text-slate-500 mb-4">Control which emails and alerts you receive from us.</p>
              <Button variant="secondary" className="h-9 px-4 text-sm">Manage Alerts</Button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="size-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={20} className="text-rose-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Password & Security</h3>
              <p className="text-sm font-medium text-slate-500 mb-4">Update your password and secure your account.</p>
              <Button variant="secondary" className="h-9 px-4 text-sm">Change Password</Button>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="size-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center shrink-0">
              <Eye size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-slate-900 dark:text-white text-lg">Profile Visibility</h3>
                 <p className="text-sm font-medium text-slate-500">Allow employers to find your profile in searches.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer shrink-0">
                 <input type="checkbox" className="sr-only peer" defaultChecked />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
               </label>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
