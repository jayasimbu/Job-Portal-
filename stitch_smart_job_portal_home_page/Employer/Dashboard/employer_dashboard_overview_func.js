// Functional logic for employer_dashboard_overview
console.log('Loaded employer_dashboard_overview_func.js');


// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu logic removed (moved to navbar.js)

    // Update welcome message and sidebar footer dynamically based on logged in user
    let userName = 'Team';
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        userName = user.name ? user.name.split(' ')[0] : 'Team';
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) {
            welcomeEl.innerHTML = `Welcome back, ${userName} 👋`;
        }

        // Update sidebar footer
        const sidebarName = document.getElementById('sidebar-user-name');
        const sidebarAvatar = document.getElementById('sidebar-user-avatar');
        if (sidebarName && user.name) sidebarName.textContent = user.name;
        if (sidebarAvatar && user.name) {
            sidebarAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
        
        // Use user.name or a mock company name to retrieve data from our DB
        const companyName = user.name || 'TechFlow Inc.';
        fetchDashboardData(companyName);
    } catch (e) {
        console.error('Error parsing user data for welcome message', e);
        fetchDashboardData('TechFlow Inc.'); // fallback
    }
});

async function fetchDashboardData(company) {
    console.log(`Fetching dashboard data for: ${company}`);
    try {
        // 1. Fetch Recent Jobs from DB.json
        const jobsResponse = await fetch('../../DB/DB.json');
        const allJobs = await jobsResponse.json();
        
        // Filter jobs for this company
        const companyJobs = allJobs.filter(job => 
            job.company.toLowerCase().includes(company.toLowerCase()) || 
            company.toLowerCase().includes(job.company.toLowerCase())
        );

        // Sort by id descending
        companyJobs.sort((a, b) => b.id - a.id);
        const recentJobs = companyJobs.slice(0, 5);

        // 2. Fetch "Top Candidates" with Deduplication
        let topCandidates = [];
        const seenCandidateIds = new Set();

        function addCandidate(cand) {
            if (!cand.id || seenCandidateIds.has(cand.id)) return;
            seenCandidateIds.add(cand.id);
            topCandidates.push(cand);
        }

        try {
            const candidateResponse = await fetch('../../DB/Job Seeker/SRIGANTH_VARATHARAJ.json');
            if (candidateResponse.ok) {
                const candData = await candidateResponse.json();
                addCandidate({
                    name: candData.personal_info?.name || 'Sriganth Varatharaj',
                    title: candData.experience?.[0]?.role || 'Software Engineer',
                    matchScore: 92,
                    id: 'sriganth'
                });
            }
        } catch (e) {
            console.warn("Could not load candidate SRIGANTH_VARATHARAJ.json", e);
        }

        // Add mock candidates ONLY if they are not already there (id check)
        const mockCandidates = [
            { name: 'Abhishek Kumar', title: 'Product Designer', matchScore: 88, id: 'abhishek' },
            { name: 'Megha Sharma', title: 'Frontend Developer', matchScore: 85, id: 'megha' }
        ];

        mockCandidates.forEach(addCandidate);

        // 3. Update Stats Dynamically
        // Logic: activeJobs = companyJobs.length, applicants = companyJobs.length * random(5-15)
        const stats = {
            activeJobs: companyJobs.length,
            totalApplicants: companyJobs.reduce((acc, job) => acc + (job.id % 20 + 5), 0),
            interviewsScheduled: Math.floor(companyJobs.length * 0.8) + 2,
            avgTimeToHire: '14 days'
        };

        if (document.getElementById('stat-active-jobs')) document.getElementById('stat-active-jobs').textContent = stats.activeJobs;
        if (document.getElementById('stat-total-applicants')) document.getElementById('stat-total-applicants').textContent = stats.totalApplicants.toLocaleString();
        if (document.getElementById('stat-interviews-scheduled')) document.getElementById('stat-interviews-scheduled').textContent = stats.interviewsScheduled;
        if (document.getElementById('stat-avg-time-to-hire')) document.getElementById('stat-avg-time-to-hire').textContent = stats.avgTimeToHire;

        // 4. Render Recent Jobs
        const jobsTbody = document.getElementById('recent-jobs-tbody');
        if (jobsTbody) {
            jobsTbody.innerHTML = '';
            if (recentJobs.length === 0) {
                jobsTbody.innerHTML = `<tr><td colspan="4" class="px-5 py-4 text-center text-slate-500">No recent job postings found for ${company}.</td></tr>`;
            } else {
                recentJobs.forEach(job => {
                    const applicantsCount = (job.id % 20 + 5);
                    jobsTbody.innerHTML += `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onclick="window.location.href='../JobManagement/employer_job_management_dashboard.html'">
                          <td class="px-5 py-4 font-medium">
                            <div>
                                <div class="font-bold">${job.title}</div>
                                <div class="text-xs text-slate-400">ID: #${job.id} • ${job.location || 'Remote'}</div>
                            </div>
                          </td>
                          <td class="px-5 py-4">
                            <span class="text-blue-600 font-bold text-sm">${applicantsCount} Applicants</span>
                          </td>
                          <td class="px-5 py-4">
                            <span class="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Active</span>
                          </td>
                          <td class="px-5 py-4 text-right">
                            <button class="text-slate-400 hover:text-blue-600 transition-colors">
                              <span class="material-symbols-outlined text-xl">visibility</span>
                            </button>
                          </td>
                        </tr>
                    `;
                });
            }
        }

        // 5. Render Top Candidates
        const topCandidatesList = document.getElementById('top-candidates-list');
        if (topCandidatesList) {
            topCandidatesList.innerHTML = '';
            topCandidates.sort((a, b) => b.matchScore - a.matchScore).forEach(cand => {
                const initials = cand.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CX';
                topCandidatesList.innerHTML += `
                    <div class="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors" onclick="window.location.href='../Candidates/ai-powered_candidate_ranking.html'">
                      <div class="flex items-center gap-3">
                        <div class="size-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                          ${initials}
                        </div>
                        <div>
                          <p class="font-bold text-sm">${cand.name}</p>
                          <p class="text-xs text-slate-500">${cand.title}</p>
                        </div>
                      </div>
                      <div class="flex flex-col items-end gap-1">
                        <span class="text-sm font-black text-blue-600">${cand.matchScore}%</span>
                        <div class="w-16 h-1.5 rounded-full bg-slate-100">
                          <div class="h-1.5 rounded-full bg-blue-600" style="width: ${cand.matchScore}%"></div>
                        </div>
                      </div>
                    </div>
                `;
            });
        }

    } catch (error) {
        console.error("Error fetching local dashboard data:", error);
    }
}


          // Populate user info from localStorage for settings
          const u = JSON.parse(localStorage.getItem('user') || '{}');
          if (u.name) {
              const nameParts = u.name.split(' ');
              const fNameInput = document.getElementById('profile-firstname');
              const lNameInput = document.getElementById('profile-lastname');
              if (fNameInput) fNameInput.value = nameParts[0] || '';
              if (lNameInput) lNameInput.value = nameParts.slice(1).join(' ') || '';
          }
          if (u.headline) {
              const headlineInput = document.getElementById('profile-headline');
              if (headlineInput) headlineInput.value = u.headline;
          }
          if (u.about) {
              const aboutInput = document.getElementById('profile-about');
              if (aboutInput) aboutInput.value = u.about;
          }

          // Save Profile Logic
          const saveProfileBtn = document.getElementById('save-profile-btn');
          if (saveProfileBtn) {
              saveProfileBtn.addEventListener('click', () => {
                  const fname = document.getElementById('profile-firstname').value.trim();
                  const lname = document.getElementById('profile-lastname').value.trim();
                  const headline = document.getElementById('profile-headline').value.trim();
                  const about = document.getElementById('profile-about').value.trim();
                  
                  const currUser = JSON.parse(localStorage.getItem('user') || '{}');
                  if(fname || lname) {
                      currUser.name = `${fname} ${lname}`.trim();
                  }
                  currUser.headline = headline;
                  currUser.about = about;
                  localStorage.setItem('user', JSON.stringify(currUser));
                  
                  // Visual feedback
                  const originalText = saveProfileBtn.textContent;
                  saveProfileBtn.textContent = 'Saved!';
                  saveProfileBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                  saveProfileBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                  
                  // Update Sidebar name if changed
                  if (currUser.name) {
                      const sidebarNameEl = document.getElementById('sidebar-name');
                      if (sidebarNameEl) sidebarNameEl.textContent = currUser.name;
                      
                      const welcomeEl = document.getElementById('welcome-message');
                      if (welcomeEl) {
                          const n = currUser.name.split(' ')[0] || 'there';
                          welcomeEl.innerHTML = `Welcome back${n !== 'there' ? ', ' + n : ''}! 👋`;
                      }
                  }

                  setTimeout(() => {
                      saveProfileBtn.textContent = originalText;
                      saveProfileBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                      saveProfileBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                  }, 2000);
              });
          }

          // Toggle slider interaction
          document.querySelectorAll('.toggle input').forEach(input => {
              input.addEventListener('change', function() {
                  const slider = this.nextElementSibling;
                  slider.style.background = this.checked ? '#2b8cee' : '#cbd5e1';
                  const knob = slider.querySelector('.toggle-knob');
                  if (knob) knob.style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
              });
              // Init state
              const slider = input.nextElementSibling;
              if (input.checked && slider) {
                  slider.style.background = '#2b8cee';
                  const knob = slider.querySelector('.toggle-knob');
                  if (knob) knob.style.transform = 'translateX(20px)';
              }
          });

          // Delete Account
          const deleteBtn = document.getElementById('deleteAccountBtn');
          if (deleteBtn) {
              deleteBtn.addEventListener('click', function() {
                  const usr = JSON.parse(localStorage.getItem('user') || '{}');
                  const email = usr.email;
                  if (!email) {
                      alert('No account found in session.');
                      return;
                  }
                  if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;

                  deleteBtn.disabled = true;
                  deleteBtn.textContent = 'Deleting...';

                  fetch('http://localhost:5000/delete-account', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: email })
                      })
                      .then(function(response) {
                          if (!response.ok) throw new Error('Failed to delete account. Please try again.');
                          return response.json();
                      })
                      .then(function() {
                          localStorage.removeItem('user');
                          localStorage.removeItem('bookmarks_' + email);
                          window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
                      })
                      .catch(function(err) {
                          const msg = document.getElementById('deleteAccountMsg');
                          if (msg) {
                              msg.textContent = err.message;
                              msg.classList.remove('hidden');
                          }
                          deleteBtn.disabled = false;
                          deleteBtn.textContent = 'Delete Account';
                      });
              });
          }
          
          // Deep link
          const params = new URLSearchParams(window.location.search);
          const tab = params.get('tab');
          if (tab) {
              const btnQuery = document.querySelector(`.dash-tab-btn[onclick*="activateTab('${tab}'"]`);
              if (btnQuery) {
                  activateTab(tab, btnQuery);
              } else if (['profile', 'notifications', 'account'].includes(tab)) {
                   activateTab(tab, null);
              }
          }


