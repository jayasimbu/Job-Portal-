export const sortByRankScore = (candidates = []) => {
  return [...candidates].sort((a, b) => (b.rank_score || 0) - (a.rank_score || 0));
};

export const topCandidates = (candidates = [], limit = 10) => sortByRankScore(candidates).slice(0, limit);



