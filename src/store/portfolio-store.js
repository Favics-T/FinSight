import { create } from 'zustand';
import { derivePortfolioMetrics } from '../features/portfolio/utils/calculations';

const STORAGE_KEY = 'finsight:portfolio:positions';

function loadPositions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePositions(positions) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
      setTimeout(resolve, 120);
    } catch (error) {
      reject(error);
    }
  });
}

function createPositionId() {
  return `pos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const usePortfolioStore = create((set, get) => ({
  positions: loadPositions(),
  priceMap: {},
  syncStatus: 'idle',
  error: null,

  setPrices: (updates) => {
    set((state) => ({ priceMap: { ...state.priceMap, ...updates } }));
  },

  addPositionOptimistic: async (payload) => {
    const previous = get().positions;
    const next = [
      ...previous,
      {
        id: createPositionId(),
        name: payload.name?.trim() || payload.symbol.toUpperCase(),
        symbol: payload.symbol.trim(),
        assetType: payload.assetType,
        quantity: Number(payload.quantity),
        averagePrice: Number(payload.averagePrice),
        createdAt: new Date().toISOString(),
      },
    ];

    set({ positions: next, syncStatus: 'saving', error: null });

    try {
      await savePositions(next);
      set({ syncStatus: 'idle' });
      return { ok: true };
    } catch (error) {
      set({ positions: previous, syncStatus: 'error', error: 'Failed to save position' });
      return { ok: false, error };
    }
  },

  updatePositionOptimistic: async (id, updates) => {
    const previous = get().positions;
    const next = previous.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updates,
            symbol: updates.symbol ? String(updates.symbol).trim() : item.symbol,
            quantity: updates.quantity != null ? Number(updates.quantity) : item.quantity,
            averagePrice: updates.averagePrice != null ? Number(updates.averagePrice) : item.averagePrice,
          }
        : item
    );

    set({ positions: next, syncStatus: 'saving', error: null });

    try {
      await savePositions(next);
      set({ syncStatus: 'idle' });
      return { ok: true };
    } catch (error) {
      set({ positions: previous, syncStatus: 'error', error: 'Failed to update position' });
      return { ok: false, error };
    }
  },

  removePositionOptimistic: async (id) => {
    const previous = get().positions;
    const next = previous.filter((item) => item.id !== id);

    set({ positions: next, syncStatus: 'saving', error: null });

    try {
      await savePositions(next);
      set({ syncStatus: 'idle' });
      return { ok: true };
    } catch (error) {
      set({ positions: previous, syncStatus: 'error', error: 'Failed to remove position' });
      return { ok: false, error };
    }
  },
}));

export const portfolioSelectors = {
  positions: (state) => state.positions,
  syncStatus: (state) => state.syncStatus,
  error: (state) => state.error,
  metrics: (state) => derivePortfolioMetrics(state.positions, state.priceMap),
  holdings: (state) => derivePortfolioMetrics(state.positions, state.priceMap).holdings,
  totals: (state) => derivePortfolioMetrics(state.positions, state.priceMap).totals,
  allocation: (state) => derivePortfolioMetrics(state.positions, state.priceMap).allocation,
  performance: (state) => derivePortfolioMetrics(state.positions, state.priceMap).performance,
};
