import React from 'react';
import EmployerShell from '../components/EmployerShell';

export default function InterviewScheduling() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#101922] font-display text-[#0d141b] dark:text-white transition-colors ">
      <EmployerShell active="interview" />
      
      <main className="flex-1 flex flex-row h-full overflow-hidden">
        
        {/* Left Sidebar: Candidate Queue */}
        <aside className="w-72 flex flex-col border-r border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2632] shrink-0 z-10">
          <div className="p-5 border-b border-slate-300 dark:border-slate-700">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
              Candidates Queue
            </h3>
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
              <button className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-700 px-3 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <p className="text-slate-900 dark:text-white text-xs font-bold">All</p>
              </button>
              <button className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white px-3 shadow-sm shadow-blue-500/30">
                <p className="text-xs font-bold">Product</p>
              </button>
              <button className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-700 px-3 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <p className="text-slate-900 dark:text-white text-xs font-bold">Eng</p>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Candidate List Placeholder */}
            <div className="flex flex-col gap-3">
              <CandidateQueueItem name="Sarah Jenkins" role="Senior UX Lead" status="Pending Schedule" img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" />
              <CandidateQueueItem name="Marcus Chen" role="Product Designer" status="Reschedule" img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" />
              <CandidateQueueItem name="Elena Rodriguez" role="UI Designer" status="Pending Schedule" img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" />
            </div>
          </div>
          <div className="p-4 border-t border-slate-300 dark:border-slate-700">
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 h-10 text-sm font-bold text-slate-900 dark:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add External Candidate
            </button>
          </div>
        </aside>

        {/* Main Content: Calendar */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#101922]">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-slate-700">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">October 2023</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-[16px]">public</span>
                <span>Eastern Standard Time (GMT-5)</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-50 dark:bg-[#1a2632] text-slate-900 dark:text-white shadow-sm">
                  Week
                </button>
                <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  Day
                </button>
              </div>
              <div className="flex gap-1">
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-[#101922]">
            {/* Time Labels Column */}
            <div className="absolute left-0 top-0 w-14 border-r border-slate-300 dark:border-slate-700 h-full bg-slate-50 dark:bg-[#101922] z-10 pt-10">
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time, idx) => (
                <div key={idx} className="h-20 text-xs text-slate-500 text-right pr-2 -mt-2.5">
                  {time}
                </div>
              ))}
            </div>

            {/* Days Header (sticky) */}
            <div className="sticky top-0 z-20 flex pl-14 bg-slate-50 dark:bg-[#101922] border-b border-slate-300 dark:border-slate-700">
              <div className="flex-1 py-3 text-center border-r border-slate-300 dark:border-slate-700 last:border-r-0">
                <div className="text-xs text-slate-500 font-medium uppercase">Mon</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">16</div>
              </div>
              <div className="flex-1 py-3 text-center border-r border-slate-300 dark:border-slate-700 last:border-r-0">
                <div className="text-xs text-slate-500 font-medium uppercase">Tue</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">17</div>
              </div>
              <div className="flex-1 py-3 text-center border-r border-slate-300 dark:border-slate-700 last:border-r-0 bg-blue-50 dark:bg-blue-900/10">
                <div className="text-xs text-blue-600 font-bold uppercase">Wed</div>
                <div className="text-lg font-bold text-blue-600">18</div>
              </div>
              <div className="flex-1 py-3 text-center border-r border-slate-300 dark:border-slate-700 last:border-r-0">
                <div className="text-xs text-slate-500 font-medium uppercase">Thu</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">19</div>
              </div>
              <div className="flex-1 py-3 text-center border-r border-slate-300 dark:border-slate-700 last:border-r-0">
                <div className="text-xs text-slate-500 font-medium uppercase">Fri</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">20</div>
              </div>
            </div>

            {/* Calendar Slots */}
            <div className="flex pl-14 h-[640px]">
              {/* Mon */}
              <div className="flex-1 border-r border-slate-300 dark:border-slate-700 relative bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_80px]">
                <div className="absolute top-[80px] left-1 right-1 h-[78px] rounded-lg bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500 p-2 text-xs">
                  <span className="font-bold text-orange-900 dark:text-orange-100 block">Team Standup</span>
                  <span className="text-orange-700 dark:text-orange-200">10:00 - 11:00</span>
                </div>
              </div>
              
              {/* Tue */}
              <div className="flex-1 border-r border-slate-300 dark:border-slate-700 relative bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_80px]">
                <div className="absolute top-[240px] left-0 right-0 h-[160px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Ik0tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsNCBsNCwtNAogICAgICAgICAgIE0zLDUgbDIsLTIiIHN0cm9rZT0iI2cbdjhiIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50"></div>
              </div>

              {/* Wed (Selected) */}
              <div className="flex-1 border-r border-slate-300 dark:border-slate-700 relative bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_80px] bg-blue-50 dark:bg-blue-900/10">
                <div className="absolute top-[400px] left-1 right-1 h-[78px] rounded-lg border-2 border-dashed border-blue-600 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-center cursor-pointer group hover:bg-blue-600 hover:border-solid hover:shadow-lg transition-all">
                  <span className="text-blue-600 font-bold group-hover:text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span>
                    2:00 PM
                  </span>
                </div>
              </div>

              {/* Thu */}
              <div className="flex-1 border-r border-slate-300 dark:border-slate-700 relative bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_80px]">
                <div className="absolute top-[160px] left-1 right-1 h-[118px] rounded-lg bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 p-2 text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-100 block">Candidate Review</span>
                  <span className="text-blue-700 dark:text-blue-200">11:00 - 12:30</span>
                </div>
              </div>

              {/* Fri */}
              <div className="flex-1 border-r border-slate-300 dark:border-slate-700 relative bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_80px]"></div>
            </div>

            {/* Current Time Line */}
            <div className="absolute left-14 right-0 top-[260px] z-30 border-t-2 border-red-500 pointer-events-none">
              <div className="absolute -top-2.5 -left-1.5 size-3 rounded-full bg-red-500"></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Smart Suggestions & Config */}
        <aside className="w-[360px] flex flex-col border-l border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2632] shrink-0 z-10 overflow-y-auto">
          {/* Smart Suggestions Card */}
          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-[#0f172a] rounded-2xl p-4 border border-blue-600/20 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-blue-600 border-blue-600 border rounded p-1 text-[16px]">auto_awesome</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Smart Suggestions
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Based on availability and your calendar.
              </p>
              <div className="space-y-2">
                 <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-colors">
                   <div>
                     <p className="text-sm outline-none font-bold">Wed, Oct 18</p>
                     <p className="text-xs text-slate-500">2:00 PM - 3:00 PM</p>
                   </div>
                   <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-md font-bold">High Match</div>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-colors">
                   <div>
                     <p className="text-sm font-bold">Thu, Oct 19</p>
                     <p className="text-xs text-slate-500">1:00 PM - 2:00 PM</p>
                   </div>
                   <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-md font-bold">Good Match</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Event Details Form */}
          <div className="px-6 pb-6 flex-1 flex flex-col gap-5">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">
              Event Details
            </h3>
            
            {/* Interview Type */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-[#1a2632] text-slate-900 dark:text-white shadow-sm text-sm font-bold">
                <span className="material-symbols-outlined text-[18px]">videocam</span>
                Virtual
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                In-Person
              </button>
            </div>

            {/* Meeting Platform */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white mb-2 block">Conferencing</label>
              <div className="relative">
                <select className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 appearance-none">
                  <option>Google Meet</option>
                  <option>Zoom</option>
                  <option>Microsoft Teams</option>
                </select>
                <div className="absolute left-3 top-3 text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">link</span>
                </div>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px] text-slate-500">expand_more</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 ml-1">
                Link will be auto-generated upon scheduling.
              </p>
            </div>

            {/* Instructions */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white mb-2 block">Notes for Candidate</label>
              <textarea
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 min-h-[100px] resize-none outline-none"
                placeholder="Enter instructions, agenda, or topics to prepare..."
              ></textarea>
            </div>

            {/* Footer Action */}
            <div className="mt-auto pt-4 border-t border-slate-300 dark:border-slate-700">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95">
                <span>Send Invite</span>
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}

function CandidateQueueItem({ name, role, status, img }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-300 dark:border-slate-700 shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-3">
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${img})` }}></div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{name}</h4>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className={`size-2 rounded-full ${status === 'Pending Schedule' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{status}</span>
      </div>
    </div>
  );
}



