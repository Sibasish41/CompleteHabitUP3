import { useState, useCallback } from 'react';

export const useDataManager = (initialData = null, options = {}) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // Cache duration in milliseconds (default: 5 minutes)
  const cacheDuration = options.cacheDuration || 5 * 60 * 1000;

  // Update data and refresh timestamp
  const updateData = useCallback((newData) => {
    setData(newData);
    setLastUpdated(Date.now());
    setIsStale(false);
  }, []);

  // Check if data needs refresh
  const needsRefresh = useCallback(() => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated > cacheDuration;
  }, [lastUpdated, cacheDuration]);

  // Optimistic update helper
  const optimisticUpdate = useCallback((updateFn, rollbackFn) => {
    const previousData = data;

    // Apply optimistic update
    updateFn(data);

    return {
      // Call this if the actual update fails
      rollback: () => {
        setData(previousData);
        if (rollbackFn) rollbackFn(previousData);
      }
    };
  }, [data]);

  // Batch update helper
  const batchUpdate = useCallback((items, updateFn) => {
    setData(prevData => {
      const newData = { ...prevData };
      items.forEach(item => {
        updateFn(newData, item);
      });
      return newData;
    });
    setLastUpdated(Date.now());
  }, []);

  // Pagination helper
  const paginate = useCallback((items, page = 1, perPage = 10) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return items.slice(start, end);
  }, []);

  // Search and filter helper
  const filterAndSort = useCallback((items, { filters = {}, sortBy, sortOrder = 'asc' }) => {
    let result = [...items];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        result = result.filter(item => {
          const itemValue = item[key];
          if (typeof value === 'function') {
            return value(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
    }

    return result;
  }, []);

  return {
    data,
    setData: updateData,
    isStale,
    setIsStale,
    lastUpdated,
    needsRefresh,
    optimisticUpdate,
    batchUpdate,
    paginate,
    filterAndSort
  };
};
