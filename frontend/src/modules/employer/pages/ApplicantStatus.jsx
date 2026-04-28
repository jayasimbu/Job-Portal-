import React from 'react';
import EmployerShell from '../components/EmployerShell';

export default function ApplicantStatus() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <EmployerShell active="candidates" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <button className="text-slate-500 hover:text-blue-600 dark:text-slate-400 text-sm font-medium transition-colors">Jobs</button>
            <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            <button className="text-slate-500 hover:text-blue-600 dark:text-slate-400 text-sm font-medium transition-colors">Senior UX Designer</button>
            <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            <span className="text-slate-900 dark:text-white text-sm font-semibold">Sarah Jenkins</span>
          </div>

          {/* Page Heading & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Sarah Jenkins
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
                  Interview Stage
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Applied for <span className="font-medium text-slate-900 dark:text-slate-200">Senior UX Designer</span> • ID: #UX-2023-849
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center h-11 px-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <span className="material-symbols-outlined mr-2 text-[20px]">mail</span>
                Email
              </button>
              <div className="relative group">
                <button className="flex items-center justify-center h-11 px-6 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">
                  Change Status
                  <span className="material-symbols-outlined ml-2 text-[20px]">expand_more</span>
                </button>
                {/* Simulated Dropdown */}
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Move to Offer</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Schedule 2nd Interview</button>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Reject Applicant</button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Profile & Info */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Candidate Profile Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-32 shadow-md border-2 border-white dark:border-slate-800"
                      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop)' }}
                    ></div>
                    <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-sm">
                      <div className="bg-green-500 size-3 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sarah Jenkins</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">San Francisco, CA</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    Available Immediately
                  </p>
                </div>

                <div className="space-y-4">
                  <ContactItem icon="mail" label="Email" value="sarah.j@example.com" />
                  <ContactItem icon="call" label="Phone" value="+1 (555) 012-3456" />
                  <ContactItem icon="language" label="Portfolio" value="sarahjenkins.design" isLink />
                </div>
              </div>

              {/* Documents Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Documents</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">View All</button>
                </div>
                <div className="space-y-3">
                  <DocumentItem icon="picture_as_pdf" color="red" name="Resume.pdf" meta="2.4 MB • Added Oct 24" />
                  <DocumentItem icon="description" color="blue" name="Cover_Letter.docx" meta="1.1 MB • Added Oct 24" />
                </div>
              </div>

            </div>

            {/* Right Column: Timeline & Internal Notes */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Vertical Timeline Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Timeline</h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total duration: 12 days</span>
                </div>
                <div className="relative">
                  
                  {/* Step 1: Applied (Completed) */}
                  <TimelineStep 
                    icon="check" 
                    title="Application Received" 
                    date="Oct 24, 2023" 
                    desc="Candidate applied through LinkedIn. Profile automatically synced." 
                    status="completed" 
                  />
                  
                  {/* Step 2: Shortlisted (Completed) */}
                  <TimelineStep 
                    icon="check" 
                    title="Shortlisted" 
                    date="Oct 26, 2023" 
                    desc="Screening passed. Strong portfolio match for the fintech project." 
                    status="completed" 
                  />
                  
                  {/* Step 3: Interview (Active) */}
                  <div className="flex gap-6 pb-12 relative">
                    {/* Connecting Line (Dashed) */}
                    <div className="absolute left-[19px] top-10 bottom-0 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700"></div>
                    {/* Active Marker */}
                    <div className="relative z-10 flex-none size-10 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center ring-4 ring-blue-600/10">
                      <span className="material-symbols-outlined text-[20px]">video_camera_front</span>
                    </div>
                    {/* Active Content */}
                    <div className="flex-1 -mt-2">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-blue-200 dark:border-blue-900/30 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-blue-600 dark:text-blue-400">Interview In Progress</h4>
                            <span className="animate-pulse size-2 rounded-full bg-blue-600"></span>
                          </div>
                          <span className="text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">Nov 02, 2023</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                          Technical interview with Lead Designer (Alex M.) and Product Manager.
                        </p>
                        <div className="flex gap-3 mt-4">
                          <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm font-semibold text-slate-700 dark:text-white hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors shadow-sm">
                            View Calendar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Offer (Future) */}
                  <div className="flex gap-6 relative opacity-60">
                    <div className="relative z-10 flex-none size-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">handshake</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-base font-bold text-slate-500 dark:text-slate-400">Offer Stage</h4>
                      <p className="text-sm text-slate-400 dark:text-slate-500">Pending interview outcome.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined">edit_note</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Internal Notes</h3>
                </div>
                
                {/* Existing Note */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shadow-sm">
                        JD
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">John Doe</span>
                    </div>
                    <span className="text-xs text-slate-400">2 days ago</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Impressive visual skills. Let's make sure to ask about her experience with design systems in the next round.
                  </p>
                </div>

                {/* New Note Input */}
                <div className="relative mt-4">
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white min-h-[100px] resize-none outline-none transition-all placeholder-slate-400"
                    placeholder="Type a new internal note here..."
                  ></textarea>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1.5 text-xs font-bold transition-colors shadow-sm shadow-blue-500/20">
                      Post Note
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function ContactItem({ icon, label, value, isLink }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`text-sm font-semibold truncate ${isLink ? 'text-slate-900 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

function DocumentItem({ icon, color, name, meta }) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg group hover:border-blue-200 dark:hover:border-blue-800 transition-colors bg-white dark:bg-slate-800/50 cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined text-${color}-500 text-[28px]`}>{icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{name}</span>
          <span className="text-xs text-slate-500">{meta}</span>
        </div>
      </div>
      <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
        <span className="material-symbols-outlined text-[20px]">download</span>
      </button>
    </div>
  );
}

function TimelineStep({ icon, title, date, desc, status }) {
  return (
    <div className="flex gap-6 pb-12 relative group">
      {/* Connecting Line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-blue-600/30 dark:bg-blue-500/20"></div>
      
      {/* Icon/Marker */}
      <div className="relative z-10 flex-none size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-600 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h4>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{date}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
