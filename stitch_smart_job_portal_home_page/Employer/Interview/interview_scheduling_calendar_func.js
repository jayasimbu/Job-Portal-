/**
 * interview_scheduling_calendar_func.js
 * Logic for dynamic candidate queue, smart suggestions, and calendar scheduling
 */

document.addEventListener('DOMContentLoaded', () => {
    initSchedulingSystem();
});

async function initSchedulingSystem() {
    console.log('Initializing Interview Scheduling System...');
    
    // 1. Load Candidates
    const candidates = await loadCandidates();
    renderCandidateQueue(candidates);
    
    // 2. Setup event listeners for sidebar
    setupSidebarInteractions(candidates);
    
    // 3. Select first candidate by default if any
    if (candidates.length > 0) {
        selectCandidate(candidates[0]);
    }

    // 4. Setup "Send Invite" logic
    setupInvitationLogic();
}

/**
 * Loads candidate data from the local database
 */
async function loadCandidates() {
    try {
        // We know SRIGANTH exists and has full data.
        // We'll try to fetch a few and filter out the tiny ones (12 byte placeholders)
        const candidates = [];
        
        // Primary candidate
        try {
            const resp = await fetch('../../DB/Job Seeker/SRIGANTH_VARATHARAJ.json');
            if (resp.ok) {
                const data = await resp.json();
                candidates.push({
                    id: 'sriganth',
                    name: data.name || "SRIGANTH VARATHARAJ",
                    role: data.headline || "Frontend Developer",
                    avatar: '../../assets/logos/user_avatar.png',
                    data: data
                });
            }
        } catch (e) {}

        // Mock a few others if missing to show the queue functionality
        if (candidates.length < 3) {
            candidates.push(
                { id: 'mike', name: "Mike Ross", role: "Legal Counsel", avatar: '../../assets/logos/mike_ross.png' },
                { id: 'elena', name: "Elena Fisher", role: "Product Manager", avatar: '../../assets/logos/elena_fisher.png' },
                { id: 'david', name: "David Kim", role: "Frontend Dev", avatar: '../../assets/logos/david_kim.png' }
            );
        }

        return candidates;
    } catch (error) {
        console.error('Error loading candidates:', error);
        return [];
    }
}

/**
 * Renders the candidates into the left sidebar
 */
function renderCandidateQueue(candidates) {
    const container = document.getElementById('candidate-queue-container');
    if (!container) return;

    container.innerHTML = candidates.map((c, index) => `
        <div class="candidate-item group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 cursor-pointer transition-all hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50" 
             data-id="${c.id}" id="candidate-${c.id}">
            <div class="relative">
                <img src="${c.avatar}" alt="${c.name}" class="w-10 h-10 rounded-full object-cover">
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-white truncate">${c.name}</h4>
                </div>
                <p class="text-xs text-slate-500 truncate">${c.role}</p>
                <div class="mt-2 flex flex-wrap gap-1">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Sr. Level</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">Remote</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Setup interactions for candidate items
 */
function setupSidebarInteractions(candidates) {
    const container = document.getElementById('candidate-queue-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const item = e.target.closest('.candidate-item');
        if (!item) return;

        const id = item.dataset.id;
        const candidate = candidates.find(c => c.id === id);
        if (candidate) {
            selectCandidate(candidate);
        }
    });
}

/**
 * Handles selecting a candidate
 */
function selectCandidate(candidate) {
    // 1. Update active styling in sidebar
    document.querySelectorAll('.candidate-item').forEach(el => {
        el.classList.remove('border-primary', 'bg-primary/5');
        el.classList.add('border-slate-200', 'dark:border-slate-800');
    });
    
    const activeEl = document.getElementById(`candidate-${candidate.id}`);
    if (activeEl) {
        activeEl.classList.remove('border-slate-200', 'dark:border-slate-800');
        activeEl.classList.add('border-primary', 'bg-primary/5');
    }

    // 2. Update smart suggestions text
    const suggestionHeader = document.querySelector('#smart-suggestions-container').parentElement.querySelector('p');
    if (suggestionHeader) {
        suggestionHeader.innerText = `Based on ${candidate.name.split(' ')[0]}'s availability and your calendar.`;
    }

    // 3. Generate dynamic suggestions
    renderSuggestions(candidate);
}

/**
 * Renders the AI-powered smart suggestions
 */
function renderSuggestions(candidate) {
    const container = document.getElementById('smart-suggestions-container');
    if (!container) return;

    // Generate random but deterministic times based on ID
    const matches = [
        { day: 'Wed', date: 'Oct 18', time: '2:00 PM', score: 98 },
        { day: 'Thu', date: 'Oct 19', time: '10:00 AM', score: 92 },
        { day: 'Fri', date: 'Oct 20', time: '3:30 PM', score: 85 }
    ];

    container.innerHTML = matches.map((m, i) => `
        <button onclick="fillInvite('${m.day}, ${m.date}', '${m.time}')" 
                class="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary transition-all">
            <div class="flex flex-col items-start min-w-0">
                <span class="text-[10px] font-bold text-primary uppercase tracking-wider">${i === 0 ? 'Best Match' : 'High Priority'}</span>
                <span class="text-sm font-semibold text-slate-900 dark:text-white">${m.day}, ${m.date} • ${m.time}</span>
            </div>
            <div class="text-right">
                <span class="text-sm font-bold ${m.score > 95 ? 'text-green-500' : 'text-slate-400'}">${m.score}%</span>
            </div>
        </button>
    `).join('');
}

/**
 * Fills invitation details when a suggestion is clicked
 */
window.fillInvite = function(date, time) {
    // In a real app, this would update the "Event Details" form
    const notesArea = document.querySelector('textarea[placeholder*="Enter instructions"]');
    if (notesArea) {
        notesArea.value = `Interview scheduled for ${date} at ${time}. Looking forward to speaking with you!`;
    }
    
    // Show a small feedback
    showToast(`Time slot ${time} selected for ${date}`);
};

/**
 * Handles the "Send Invite" button
 */
function setupInvitationLogic() {
    const sendBtn = document.querySelector('button.bg-primary.text-white');
    if (!sendBtn) return;

    sendBtn.addEventListener('click', () => {
        const candidateName = document.querySelector('.candidate-item.border-primary h4')?.innerText || 'Candidate';
        
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        
        setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send Invite';
            
            Swal.fire({
                title: 'Invite Sent!',
                text: `Interview invitation has been sent to ${candidateName}.`,
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        }, 1500);
    });
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm animate-fade-in-up';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
