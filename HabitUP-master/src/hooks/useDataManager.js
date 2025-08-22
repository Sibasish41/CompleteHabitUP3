import { useState, useEffect, useCallback } from 'react';
import { useOnlineStatus } from './dataSync';
import { Cache } from './storage';
import Performance from './performance';
import { withRetry } from './retry';
import Notify from './notify';
import logger from './logger';

export const useDataManager = (options = {}) => {
  const {
    key, // Cache key for this data
    fetchData, // Function to fetch the data
    initialData = null,
    cacheDuration = 5, // Cache duration in minutes
    retryOptions = {}, // Options for retry mechanism
    autoRefresh = false, // Whether to auto-refresh data
    refreshInterval = 60000, // Refresh interval in milliseconds
    onError = null, // Custom error handler
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isOnline = useOnlineStatus();

  // Load data with retry, caching, and performance tracking
  const loadData = useCallback(async (force = false) => {
    // Check cache first unless force refresh
    if (!force && key) {
      const cached = Cache.get(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Track performance and attempt fetch with retry
      const result = await Performance.trackAsync(
        async () => withRetry(fetchData, retryOptions),
        `fetch_${key}`
      );

      // Update state and cache
      setData(result);
      setLastUpdated(Date.now());

      if (key) {
        Cache.set(key, result, cacheDuration);
      }
    } catch (err) {
      logger.error(err, { key, operation: 'loadData' });
      setError(err);

      if (onError) {
        onError(err);
      } else {
        Notify.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetchData, cacheDuration, retryOptions, onError]);

  // Handle auto-refresh
  useEffect(() => {
    if (!autoRefresh || !isOnline) return;

    const interval = setInterval(() => {
      loadData(true); // Force refresh
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isOnline, loadData]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Optimistic update helper
  const optimisticUpdate = useCallback((updateFn) => {
    const previousData = data;

    // Apply optimistic update
    setData(current => {
      const updated = { ...current };
      updateFn(updated);
      return updated;
    });

    return {
      // Call this if the actual update fails
      rollback: () => {
        setData(previousData);
        Notify.error('Failed to update data');
      }
    };
  }, [data]);

  // Batch update helper
  const batchUpdate = useCallback(async (items, updateFn) => {
    const previousData = data;

    try {
      setLoading(true);

      // Apply updates optimistically
      setData(current => {
        const updated = { ...current };
        items.forEach(item => updateFn(updated, item));
        return updated;
      });

      // Perform actual update
      await Performance.trackAsync(
        () => withRetry(() => Promise.all(items.map(updateFn))),
        `batch_update_${key}`
      );

      // Update cache
      if (key) {
        Cache.set(key, data, cacheDuration);
      }

      Notify.success('Updates saved successfully');
    } catch (err) {
      // Rollback on failure
      setData(previousData);
      logger.error(err, { key, operation: 'batchUpdate' });
      Notify.error('Failed to save updates');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [data, key, cacheDuration]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isOnline,
    refresh: () => loadData(true),
    optimisticUpdate,
    batchUpdate
  };
};
