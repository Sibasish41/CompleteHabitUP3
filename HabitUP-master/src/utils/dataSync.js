import { useState, useEffect } from 'react';
import { Cache } from './storage';
import Notify from './notify';

// Queue for storing offline actions
const actionQueue = [];
let isProcessingQueue = false;

// Process queued actions when back online
async function processQueue() {
  if (isProcessingQueue || actionQueue.length === 0) return;

  isProcessingQueue = true;

  while (actionQueue.length > 0) {
    const action = actionQueue[0];
    try {
      await action.execute();
      actionQueue.shift(); // Remove processed action

      // Save updated queue to storage
      Cache.set('actionQueue', actionQueue);
    } catch (error) {
      console.error('Error processing queued action:', error);
      // Leave action in queue if it fails
      break;
    }
  }

  isProcessingQueue = false;
}

// Hook for managing online/offline state
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function onOnline() {
      setIsOnline(true);
      Notify.success('Back online!');
      processQueue();
    }

    function onOffline() {
      setIsOnline(false);
      Notify.warning('You are offline. Changes will be saved when you reconnect.');
    }

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Load saved queue on mount
    const savedQueue = Cache.get('actionQueue');
    if (savedQueue) {
      actionQueue.push(...savedQueue);
      if (navigator.onLine) {
        processQueue();
      }
    }

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return isOnline;
}

// Queue an action for offline support
export function queueAction(action) {
  actionQueue.push(action);
  Cache.set('actionQueue', actionQueue);

  if (navigator.onLine) {
    processQueue();
  }
}

// Create an offline-capable API request
export function createOfflineAction(apiCall, rollback) {
  return {
    execute: apiCall,
    rollback,
    timestamp: Date.now()
  };
}

// Hook for data synchronization
export function useDataSync(key, fetchData, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOnline = useOnlineStatus();

  const { cacheDuration = 5 } = options;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Try to get cached data first
        const cachedData = Cache.get(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
        }

        // If online, fetch fresh data
        if (isOnline) {
          const freshData = await fetchData();
          setData(freshData);
          Cache.set(key, freshData, cacheDuration);
        }
      } catch (err) {
        setError(err);
        Notify.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [key, isOnline, fetchData, cacheDuration]);

  return { data, loading, error, isOnline };
}

// Utility for batch synchronization
export async function syncBatch(actions) {
  const results = {
    success: [],
    failed: []
  };

  for (const action of actions) {
    try {
      const result = await action.execute();
      results.success.push({ action, result });
    } catch (error) {
      results.failed.push({ action, error });

      // Try to rollback successful actions
      for (const { action: successfulAction } of results.success) {
        if (successfulAction.rollback) {
          try {
            await successfulAction.rollback();
          } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
          }
        }
      }

      throw new Error('Batch sync failed');
    }
  }

  return results;
}
