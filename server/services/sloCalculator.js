const calculateSloStatus = (targetSloPercent, goodRequests, totalRequests, windowMinutes = 1440) => {
  if (totalRequests === 0) {
    return {
      sliPercent: 100.0,
      targetSloPercent,
      errorBudgetPercent: (100.0 - targetSloPercent),
      remainingErrorBudgetPercent: 100.0,
      isCompliant: true,
      burnRate: 0.0
    };
  }

  const actualSli = (goodRequests / totalRequests) * 100.0;
  const totalErrorBudget = 100.0 - targetSloPercent;
  const errorRate = 100.0 - actualSli;

  const remainingBudgetPercent = Math.max(0, ((totalErrorBudget - errorRate) / totalErrorBudget) * 100.0);
  const burnRate = totalErrorBudget > 0 ? parseFloat((errorRate / totalErrorBudget).toFixed(2)) : 0;

  return {
    sliPercent: parseFloat(actualSli.toFixed(3)),
    targetSloPercent,
    errorBudgetPercent: parseFloat(totalErrorBudget.toFixed(3)),
    remainingErrorBudgetPercent: parseFloat(remainingBudgetPercent.toFixed(1)),
    isCompliant: actualSli >= targetSloPercent,
    burnRate
  };
};

module.exports = { calculateSloStatus };
