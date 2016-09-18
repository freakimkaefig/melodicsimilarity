var ResultHelper = {};

ResultHelper.SORT_FUNCTION = function(a, b) {
  return a.rank - b.rank || b.maxSimilarityCount - a.maxSimilarityCount || a.id > b.id;
};

module.exports = ResultHelper;