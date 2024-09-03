const calculateBlastRadius = (rootServiceId, allServices) => {
  const impacted = new Set();
  const queue = [rootServiceId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    allServices.forEach(candidate => {
      if (candidate.dependencies && candidate.dependencies.includes(currentId)) {
        if (!impacted.has(candidate.serviceId)) {
          impacted.add(candidate.serviceId);
          queue.push(candidate.serviceId);
        }
      }
    });
  }

  return Array.from(impacted);
};

module.exports = { calculateBlastRadius };
