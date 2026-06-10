// Functional logic for employer_job_management_dashboard
console.log('Loaded employer_job_management_dashboard_func.js');

document.addEventListener('DOMContentLoaded', () => {
    // Dynamic user details in sidebar
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const sidebarName = document.getElementById('sidebar-user-name');
        const sidebarAvatar = document.getElementById('sidebar-user-avatar');
        
        if (sidebarName && user.name) sidebarName.textContent = user.name;
        if (sidebarAvatar && user.name) {
            sidebarAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
    } catch (e) {
        console.error("Error populating sidebar footer", e);
    }

    // Placeholder for rendering dashboard stats (if any)
    // renderStats(); 

    let companyName = 'TechFlow Inc.'; // fallback
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.name) companyName = user.name;
    } catch (e) {
        console.error('Error parsing user data', e);
    }
    
    fetchEmployerJobs(companyName);
});

async function fetchEmployerJobs(company) {
    console.log(`Fetching jobs for: ${company}`);
    try {
        const response = await fetch('../../DB/DB.json');
        const allJobs = await response.json();
        
        // Filter jobs for this company
        const companyJobs = allJobs.filter(job => 
            job.company.toLowerCase().includes(company.toLowerCase()) || 
            company.toLowerCase().includes(job.company.toLowerCase())
        );

        const tbody = document.getElementById('jobs-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (companyJobs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">No jobs posted yet for ${company}.</td></tr>`;
            return;
        }
        
        companyJobs.forEach(job => {
            const statusColor = 'text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
            const statusDot = 'bg-green-500';
            
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer';
            // Make the whole row or the visibility button go to a detailed view if needed,
            // but for now, let's satisfy "candidates sections are not opening".
            
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <div class="text-sm font-bold text-[#0d141b] dark:text-white">
                      ${job.title}
                    </div>
                    <div class="text-xs text-[#4c739a]">
                      ${job.category || 'General'} • ${job.location || 'Remote'}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-[#0d141b] dark:text-gray-300">
                     Recently
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-[#0d141b] dark:text-white">
                    12
                    <span class="text-xs font-normal text-green-600 ml-1">(2 new)</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center -space-x-2 overflow-hidden">
                    <div title="Sarah Jenkins" class="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1A2633] bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-bold shrink-0 cursor-pointer hover:scale-110 transition-transform" onclick="event.stopPropagation(); window.location.href='../Candidates/applicant_status_control_page.html'">
                      SJ
                    </div>
                    <div title="Sriganth V." class="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1A2633] bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold shrink-0 cursor-pointer hover:scale-110 transition-transform" onclick="event.stopPropagation(); window.location.href='../Candidates/applicant_status_control_page.html'">
                      SV
                    </div>
                    <div class="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1A2633] bg-primary/10 text-primary text-xs font-bold">
                      +10
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}">
                    <span class="h-1.5 w-1.5 rounded-full ${statusDot}"></span>
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button class="text-primary hover:text-blue-700 flex items-center gap-1 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group" title="Use AI to find more candidates">
                      <span class="material-symbols-outlined text-lg animate-pulse">auto_awesome</span>
                      <span class="text-xs font-bold">Boost</span>
                    </button>
                    <button class="text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onclick="window.location.href='../Candidates/applicant_status_control_page.html'">
                      <span class="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching local employer jobs:", error);
    }
}

