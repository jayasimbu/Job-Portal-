/**
 * bookmark_service.js — Career Auto
 *
 * Manages per-user bookmarked jobs.
 * Bookmarks are stored in localStorage under a key scoped to the logged-in user's email,
 * so each user has their own independent saved jobs list.
 *
 * Usage (after AuthGuard is loaded):
 *   BookmarkService.getAll()              → array of saved job objects
 *   BookmarkService.getIds()              → Set of saved job IDs
 *   BookmarkService.isSaved(jobId)        → boolean
 *   BookmarkService.save(jobObj)          → saves a job object, returns true
 *   BookmarkService.remove(jobId)         → removes a job by id, returns true
 *   BookmarkService.toggle(jobObj)        → saves or removes, returns { saved: bool }
 *   BookmarkService.clear()              → clears all bookmarks for current user
 */

const BookmarkService = (() => {

    // Key prefix — actual key = `ca_bookmarks_${userEmail}` or fallback for guests
    const KEY_PREFIX = 'ca_bookmarks_';
    const GUEST_KEY = 'ca_bookmarks_guest';

    /** Returns the localStorage key for the current user */
    function _storageKey() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user && user.email) return KEY_PREFIX + user.email;
        } catch {}
        return GUEST_KEY;
    }

    /** Returns an array of all saved job objects for this user */
    function getAll() {
        try {
            return JSON.parse(localStorage.getItem(_storageKey()) || '[]');
        } catch {
            return [];
        }
    }

    /** Persists an array of job objects for this user */
    function _setAll(jobs) {
        localStorage.setItem(_storageKey(), JSON.stringify(jobs));
    }

    /** Returns a Set of saved job IDs */
    function getIds() {
        return new Set(getAll().map(j => j.id));
    }

    /** Returns true if a job with the given id is bookmarked */
    function isSaved(jobId) {
        return getIds().has(jobId);
    }

    /**
     * Saves a job object. The job object should contain:
     *   id, title, company, location, salary, type, tags, url, (optional) iconEmoji/iconBg/iconColor
     * Returns true.
     */
    function save(jobObj) {
        const jobs = getAll();
        if (!jobs.find(j => j.id === jobObj.id)) {
            jobs.push({
                ...jobObj,
                savedAt: Date.now()
            });
            _setAll(jobs);
        }
        return true;
    }

    /** Removes a job by id. Returns true. */
    function remove(jobId) {
        const jobs = getAll().filter(j => j.id !== jobId);
        _setAll(jobs);
        return true;
    }

    /**
     * Toggles bookmark for a job.
     * @param {object} jobObj — full job object (needed if saving)
     * @returns {{ saved: boolean }} — whether the job is now saved
     */
    function toggle(jobObj) {
        if (isSaved(jobObj.id)) {
            remove(jobObj.id);
            return {
                saved: false
            };
        } else {
            save(jobObj);
            return {
                saved: true
            };
        }
    }

    /** Clears all bookmarks for the current user */
    function clear() {
        localStorage.removeItem(_storageKey());
    }

    return {
        getAll,
        getIds,
        isSaved,
        save,
        remove,
        toggle,
        clear
    };

})();