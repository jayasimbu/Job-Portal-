// Migrated conceptually from legacy assets/js/bookmark_service.js
const STORAGE_KEY = 'jobseeker_bookmarked_jobs';

const readList = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeList = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const getBookmarks = () => readList();

export const isBookmarked = (jobId) => readList().includes(jobId);

export const toggleBookmark = (jobId) => {
  const list = readList();
  const next = list.includes(jobId) ? list.filter((id) => id !== jobId) : [...list, jobId];
  writeList(next);
  return next;
};



