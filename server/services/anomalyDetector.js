const evaluateZScore = (value, historyArray) => {
  if (!historyArray || historyArray.length < 3) return { isAnomaly: false, zScore: 0 };

  const mean = historyArray.reduce((acc, v) => acc + v, 0) / historyArray.length;
  const variance = historyArray.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / historyArray.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return { isAnomaly: false, zScore: 0 };

  const zScore = (value - mean) / stdDev;
  return {
    isAnomaly: Math.abs(zScore) >= 2.5,
    zScore: parseFloat(zScore.toFixed(2)),
    mean: parseFloat(mean.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2))
  };
};

const detectMetricAnomaly = (currentSnapshot, historicalSnapshots) => {
  const latencyHistory = historicalSnapshots.map(s => s.latencyP95Ms);
  const errorHistory = historicalSnapshots.map(s => s.errorRatePercent);

  const latencyEval = evaluateZScore(currentSnapshot.latencyP95Ms, latencyHistory);
  const errorEval = evaluateZScore(currentSnapshot.errorRatePercent, errorHistory);

  const reasons = [];
  if (latencyEval.isAnomaly) {
    reasons.push(`Latency P95 deviation z-score: ${latencyEval.zScore} (mean: ${latencyEval.mean}ms)`);
  }
  if (errorEval.isAnomaly) {
    reasons.push(`Error rate deviation z-score: ${errorEval.zScore} (mean: ${errorEval.mean}%)`);
  }
  if (currentSnapshot.errorRatePercent >= 5.0) {
    reasons.push(`Critical error threshold breached: ${currentSnapshot.errorRatePercent}%`);
  }

  return {
    hasAnomaly: reasons.length > 0,
    reasons,
    latencyEval,
    errorEval
  };
};

module.exports = { evaluateZScore, detectMetricAnomaly };
