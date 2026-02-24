function shallowEqualArray(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function shallowEqualObject(a, b) {
  if (a === b) return true;
  const aKeys = Object.keys(a || {});
  const bKeys = Object.keys(b || {});
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function memoizeByRefs(fn) {
  let prevPositions = null;
  let prevPriceMap = null;
  let prevResult = null;

  return (positions, priceMap) => {
    if (
      prevResult &&
      shallowEqualArray(prevPositions, positions) &&
      shallowEqualObject(prevPriceMap, priceMap)
    ) {
      return prevResult;
    }

    prevPositions = positions;
    prevPriceMap = priceMap;
    prevResult = fn(positions, priceMap);
    return prevResult;
  };
}

export function getPositionKey(position) {
  return `${position.assetType}:${String(position.symbol).toLowerCase()}`;
}

function compute(positions, priceMap) {
  const holdings = positions.map((position) => {
    const currentPrice = Number(priceMap[getPositionKey(position)] || 0);
    const quantity = Number(position.quantity || 0);
    const averagePrice = Number(position.averagePrice || 0);

    const costBasis = quantity * averagePrice;
    const marketValue = quantity * currentPrice;
    const unrealizedPL = marketValue - costBasis;
    const unrealizedPLPercent = costBasis > 0 ? (unrealizedPL / costBasis) * 100 : 0;

    return {
      ...position,
      currentPrice,
      costBasis,
      marketValue,
      unrealizedPL,
      unrealizedPLPercent,
      allocationPercent: 0,
    };
  });

  const totalCostBasis = holdings.reduce((sum, item) => sum + item.costBasis, 0);
  const totalMarketValue = holdings.reduce((sum, item) => sum + item.marketValue, 0);
  const totalUnrealizedPL = totalMarketValue - totalCostBasis;

  const holdingsWithAllocation = holdings.map((item) => ({
    ...item,
    allocationPercent: totalMarketValue > 0 ? (item.marketValue / totalMarketValue) * 100 : 0,
  }));

  const allocation = holdingsWithAllocation
    .filter((item) => item.marketValue > 0)
    .map((item) => ({
      id: item.id,
      label: `${item.symbol.toUpperCase()} (${item.assetType})`,
      value: item.marketValue,
      allocationPercent: item.allocationPercent,
    }))
    .sort((a, b) => b.value - a.value);

  const now = Date.now();
  const performance = Array.from({ length: 30 }).map((_, index) => {
    const x = new Date(now - (29 - index) * 24 * 60 * 60 * 1000);
    const factor = index / 29;
    const wave = Math.sin(index / 4) * 0.02;
    const value = totalCostBasis + (totalMarketValue - totalCostBasis) * factor + totalMarketValue * wave;

    return {
      label: `${x.getMonth() + 1}/${x.getDate()}`,
      value: Math.max(0, value),
    };
  });

  return {
    holdings: holdingsWithAllocation,
    totals: {
      totalCostBasis,
      totalMarketValue,
      totalUnrealizedPL,
      totalUnrealizedPLPercent:
        totalCostBasis > 0 ? (totalUnrealizedPL / totalCostBasis) * 100 : 0,
    },
    allocation,
    performance,
  };
}

export const derivePortfolioMetrics = memoizeByRefs(compute);

export function validatePositionInput(input) {
  const errors = {};

  if (!input.assetType || !['stock', 'crypto'].includes(input.assetType)) {
    errors.assetType = 'Select stock or crypto';
  }
  if (!input.symbol || input.symbol.trim().length < 2) {
    errors.symbol = 'Symbol is required';
  }
  if (!Number.isFinite(Number(input.quantity)) || Number(input.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }
  if (!Number.isFinite(Number(input.averagePrice)) || Number(input.averagePrice) <= 0) {
    errors.averagePrice = 'Average price must be greater than 0';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
