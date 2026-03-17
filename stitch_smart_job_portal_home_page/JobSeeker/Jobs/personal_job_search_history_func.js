// ============================================================
// Search History — Full Functional Logic
// Fixes: Connects to Backend DB, Clear All, Keyword/Sort filters,
//        Pagination, Run Again navigation, Delete Individual Item
// ============================================================

(function () {
    'use strict';

    // ── Constants ──────────────────────────────────────────────
    const ITEMS_PER_PAGE = 5;
    const BROWSE_JOBS_URL = '../../Platform/Search/advanced_job_search_&_filtering.html';

    // ── State ──────────────────────────────────────────────────
    const state = {
        allEntries: [], // Fetched from backend
        filtered: [],   // After keyword filter
        keyword: '',
        sortOldest: false,
        currentPage: 1,
    };

    // ── Helpers ────────────────────────────────────────────────
    function getUserEmail() {
        try {
            const u = JSON.parse(localStorage.getItem('user') || '{}');
            return u.email || null;
        } catch {
            return null;
        }
    }

    async function loadHistoryFromServer() {
        const email = getUserEmail();
        if (!email) return [];
        try {
            const res = await fetch(`http://localhost:5000/api/user/search-history?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.success) {
                return data.searchHistory || [];
            }
        } catch (e) {
            console.error('Error fetching search history:', e);
        }
        return [];
    }

    async function deleteHistoryItemFromServer(timestamp) {
        const email = getUserEmail();
        if (!email) return false;
        try {
            const res = await fetch('http://localhost:5000/api/user/search-history', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, timestamp: timestamp })
            });
            const data = await res.json();
            return data.success;
        } catch (e) {
            console.error('Error deleting search history item:', e);
            return false;
        }
    }

    async function clearHistoryOnServer() {
        const email = getUserEmail();
        if (!email) return false;
        try {
            const res = await fetch('http://localhost:5000/api/user/search-history', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, clear_all: true })
            });
            const data = await res.json();
            return data.success;
        } catch (e) {
            console.error('Error clearing search history:', e);
            return false;
        }
    }

    function formatDate(isoStr) {
        if (!isoStr) return 'Unknown date';
        const d = new Date(isoStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffH = Math.floor(diffMin / 60);
        const diffD = Math.floor(diffH / 24);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffH < 24) return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        if (diffD === 1) return 'Searched yesterday';
        if (diffD < 7) return `Searched ${diffD} days ago`;
        return `Searched ${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    // ── Filter + Sort ──────────────────────────────────────────
    function applyFiltersAndRender() {
        let entries = [...state.allEntries];

        // Keyword filter
        if (state.keyword.trim()) {
            const kw = state.keyword.toLowerCase();
            entries = entries.filter(e =>
                (e.query || '').toLowerCase().includes(kw) ||
                (e.location || '').toLowerCase().includes(kw)
            );
        }

        // Sort
        entries.sort((a, b) => {
            const tA = new Date(a.timestamp || 0).getTime();
            const tB = new Date(b.timestamp || 0).getTime();
            return state.sortOldest ? tA - tB : tB - tA;
        });

        state.filtered = entries;
        state.currentPage = 1;
        render();
    }

    // ── Render List ────────────────────────────────────────────
    function render() {
        const listEl = document.getElementById('history-list');
        const emptyEl = document.getElementById('empty-state');
        const countEl = document.getElementById('result-count');
        if (!listEl) return;

        const total = state.filtered.length;
        countEl.textContent = `Showing ${total} recent search${total !== 1 ? 'es' : ''}`;

        if (total === 0) {
            listEl.innerHTML = '';
            emptyEl.classList.remove('hidden');
            renderPagination(0);
            return;
        }

        emptyEl.classList.add('hidden');

        const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
        const page = state.filtered.slice(start, start + ITEMS_PER_PAGE);

        listEl.innerHTML = '';
        page.forEach(entry => {
            const card = buildCard(entry);
            listEl.appendChild(card);
        });

        renderPagination(total);
    }

    // ── Build a single card ────────────────────────────────────
    function buildCard(entry) {
        const iconBg = 'bg-[#e7edf3] dark:bg-[#2a3b4d] text-[#0d141b] dark:text-white';
        const iconName = 'search';

        const div = document.createElement('div');
        div.className = 'group flex flex-col md:flex-row gap-2 bg-white dark:bg-[#1a2632] p-2 rounded-xl border border-transparent hover:border-primary/20 hover:shadow-md transition-all duration-200 relative';
        div.innerHTML = `
        <div class="flex items-start gap-2 flex-1">
          <div class="flex items-center justify-center rounded-lg ${iconBg} shrink-0 w-7 h-7">
            <span class="material-symbols-outlined text-[16px]">${iconName}</span>
          </div>
          <div class="flex flex-col justify-center gap-0">
            <h3 class="text-[#0d141b] dark:text-white text-sm font-bold leading-tight">${escHtml(entry.query || 'Unknown Search')}</h3>
            <p class="text-[#4c739a] dark:text-slate-400 text-[10px] font-medium pr-6">
                 ${entry.location ? escHtml(entry.location) + ' • ' : ''}${formatDate(entry.timestamp)}
            </p>
          </div>
      </div>
      <div class="flex items-center justify-end border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0 mt-1 md:mt-0">
        <button
          class="run-again-btn flex items-center justify-center rounded-lg h-6 px-3 bg-primary hover:bg-blue-600 text-white text-[10px] font-bold transition-colors shadow-sm shadow-blue-200 dark:shadow-none min-w-[80px]"
          data-query="${escAttr(entry.query || '')}"
          data-location="${escAttr(entry.location || '')}"
        >
          Run Again
        </button>
      </div>
      
      <!-- Delete Button (Cross) -->
      <button 
        class="delete-btn absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-[#1a2632] rounded-full p-0.5 border border-transparent hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
        data-timestamp="${escAttr(entry.timestamp)}"
        title="Delete search"
      >
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    `;

        // Delete click
        div.querySelector('.delete-btn').addEventListener('click', async (e) => {
            // Store original icon to show loading if we wanted, but let's just do it
            const timestamp = e.currentTarget.dataset.timestamp;
            await deleteSearchEntry(timestamp);
        });

        // Run Again click
        div.querySelector('.run-again-btn').addEventListener('click', (e) => {
            const q = e.currentTarget.dataset.query;
            const loc = e.currentTarget.dataset.location;
            const params = new URLSearchParams();
            if (q) params.set('q', q);
            if (loc) params.set('location', loc);
            window.location.href = `${BROWSE_JOBS_URL}?${params.toString()}`;
        });

        return div;
    }

    // ── Delete single search ───────────────────────────────────
    async function deleteSearchEntry(timestamp) {
        const success = await deleteHistoryItemFromServer(timestamp);
        if (success) {
            state.allEntries = state.allEntries.filter(e => e.timestamp !== timestamp);
            applyFiltersAndRender();
            showToast('Search item deleted', 'success');
        } else {
            showToast('Failed to delete item', 'error');
        }
    }

    // ── Pagination ─────────────────────────────────────────────
    function renderPagination(total) {
        const container = document.getElementById('pagination-container');
        if (!container) return;
        container.innerHTML = '';

        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        const cur = state.currentPage;

        // Prev button
        container.appendChild(makePagBtn(
            '<span class="material-symbols-outlined">chevron_left</span>',
            cur > 1,
            () => goToPage(cur - 1)
        ));

        // Page numbers
        let startP = Math.max(1, cur - 2);
        let endP = Math.min(totalPages, startP + 4);
        if (endP - startP < 4) startP = Math.max(1, endP - 4);

        for (let i = startP; i <= endP; i++) {
            const active = i === cur;
            const btn = document.createElement('button');
            btn.className = active ?
                'flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white text-xs font-bold' :
                'flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-[#1a2632] border border-[#e7edf3] dark:border-[#2a3b4d] text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#23303d] text-xs font-medium transition-colors';
            btn.textContent = i;
            if (!active) btn.addEventListener('click', () => goToPage(i));
            container.appendChild(btn);
        }

        // Ellipsis + last
        if (endP < totalPages) {
            const dots = document.createElement('span');
            dots.className = 'flex items-center justify-center w-8 h-8 text-gray-400 text-xs';
            dots.textContent = '...';
            container.appendChild(dots);

            container.appendChild(makePagBtn(
                totalPages,
                true,
                () => goToPage(totalPages)
            ));
        }

        // Next button
        container.appendChild(makePagBtn(
            '<span class="material-symbols-outlined">chevron_right</span>',
            cur < totalPages,
            () => goToPage(cur + 1)
        ));
    }

    function makePagBtn(label, enabled, onClick) {
        const btn = document.createElement('button');
        btn.className = `flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-[#1a2632] border border-[#e7edf3] dark:border-[#2a3b4d] text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#23303d] transition-colors ${!enabled ? 'opacity-40 cursor-not-allowed' : ''}`;
        btn.innerHTML = label;
        btn.disabled = !enabled;
        if (enabled) btn.addEventListener('click', onClick);
        return btn;
    }

    function goToPage(page) {
        state.currentPage = page;
        render();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ── Toast notification ─────────────────────────────────────
    function showToast(message, type = 'success') {
        let container = document.getElementById('sh-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'sh-toast-container';
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3';
            document.body.appendChild(container);
        }

        const colorMap = {
            success: 'bg-slate-800',
            info: 'bg-blue-600',
            error: 'bg-red-600'
        };
        const iconMap = {
            success: 'check_circle',
            info: 'info',
            error: 'error'
        };

        const toast = document.createElement('div');
        toast.className = `${colorMap[type] || 'bg-slate-800'} text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-3`;
        toast.innerHTML = `
      <span class="material-symbols-outlined text-sm">${iconMap[type] || 'check_circle'}</span>
      <span class="font-medium text-sm">${message}</span>
    `;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ── Confirm modal for Clear All ────────────────────────────
    function showClearConfirm() {
        const existing = document.getElementById('sh-clear-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'sh-clear-modal';
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
        overlay.innerHTML = `
      <div class="bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <span class="material-symbols-outlined text-red-500">delete_sweep</span>
          </div>
          <h3 class="text-lg font-bold text-[#0d141b] dark:text-white">Clear All History?</h3>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">This will permanently remove all your search history. This action cannot be undone.</p>
        <div class="flex gap-3">
          <button id="sh-cancel-btn" class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          <button id="sh-confirm-btn" class="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">Clear All</button>
        </div>
      </div>
    `;

        document.body.appendChild(overlay);

        overlay.querySelector('#sh-cancel-btn').addEventListener('click', () => overlay.remove());
        overlay.querySelector('#sh-confirm-btn').addEventListener('click', async () => {
            // Show loading state on button
            const confirmBtn = overlay.querySelector('#sh-confirm-btn');
            const origText = confirmBtn.textContent;
            confirmBtn.textContent = 'Clearing...';
            confirmBtn.disabled = true;

            const success = await clearHistoryOnServer();

            if (success) {
                state.allEntries = [];
                state.keyword = '';
                state.sortOldest = false;

                const keywordInput = document.getElementById('keyword-input');
                if (keywordInput) keywordInput.value = '';

                const keywordLabel = document.getElementById('keyword-label');
                if (keywordLabel) keywordLabel.textContent = 'Keywords';

                const sortLabel = document.getElementById('sort-label');
                if (sortLabel) sortLabel.textContent = 'Sort: Newest';

                applyFiltersAndRender();
                overlay.remove();
                showToast('All search history cleared.', 'info');
            } else {
                showToast('Failed to clear search history', 'error');
                confirmBtn.textContent = origText;
                confirmBtn.disabled = false;
            }
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    // ── Escape helpers ─────────────────────────────────────────
    function escHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function escAttr(str) {
        return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ── Init ───────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', async function () {
        // Load from Server
        state.allEntries = await loadHistoryFromServer();

        // Wire: Clear All button
        const clearBtn = document.getElementById('clear-all-btn');
        if (clearBtn) clearBtn.addEventListener('click', () => {
            if (state.allEntries.length === 0) {
                showToast('History is already empty.', 'info');
                return;
            }
            showClearConfirm();
        });

        // Wire: Keyword button
        const keywordBtn = document.getElementById('keyword-btn');
        const keywordDropdown = document.getElementById('keyword-dropdown');
        const keywordInput = document.getElementById('keyword-input');
        const keywordLabel = document.getElementById('keyword-label');
        const keywordClear = document.getElementById('keyword-clear');

        if (keywordBtn) {
            keywordBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                keywordDropdown.classList.toggle('hidden');
                if (!keywordDropdown.classList.contains('hidden')) {
                    keywordInput.focus();
                }
            });
        }

        if (keywordInput) {
            keywordInput.addEventListener('input', () => {
                state.keyword = keywordInput.value;
                const hasKw = state.keyword.trim().length > 0;
                keywordLabel.textContent = hasKw ? `"${state.keyword}"` : 'Keywords';
                applyFiltersAndRender();
            });
        }

        if (keywordClear) {
            keywordClear.addEventListener('click', () => {
                keywordInput.value = '';
                state.keyword = '';
                keywordLabel.textContent = 'Keywords';
                applyFiltersAndRender();
            });
        }

        // Close keyword dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!keywordDropdown.contains(e.target) && e.target !== keywordBtn && keywordDropdown && !keywordDropdown.classList.contains('hidden')) {
                keywordDropdown.classList.add('hidden');
            }
        });

        // Wire: Sort button
        const sortBtn = document.getElementById('sort-btn');
        const sortLabel = document.getElementById('sort-label');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                state.sortOldest = !state.sortOldest;
                sortLabel.textContent = state.sortOldest ? 'Sort: Oldest' : 'Sort: Newest';
                applyFiltersAndRender();
            });
        }

        // Initial render
        applyFiltersAndRender();
    });

})();