// Constants for storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CACHED_DATA: 'cached_data'
};

// Storage wrapper with expiry
class Storage {
  static set(key, value, expiryInMinutes = null) {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: expiryInMinutes ? Date.now() + (expiryInMinutes * 60 * 1000) : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { value, expiry } = JSON.parse(item);
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

// Cache management
class Cache {
  static set(key, data, expiryInMinutes = 5) {
    const cacheKey = `${STORAGE_KEYS.CACHED_DATA}_${key}`;
    Storage.set(cacheKey, data, expiryInMinutes);
  }

  static get(key) {
    const cacheKey = `${STORAGE_KEYS.CACHED_DATA}_${key}`;
    return Storage.get(cacheKey);
  }

  static remove(key) {
    const cacheKey = `${STORAGE_KEYS.CACHED_DATA}_${key}`;
    Storage.remove(cacheKey);
  }

  static clearAll() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEYS.CACHED_DATA))
      .forEach(key => Storage.remove(key));
  }
}

// User preferences management
class UserPreferences {
  static set(preferences) {
    const current = UserPreferences.get() || {};
    Storage.set(STORAGE_KEYS.USER_PREFERENCES, {
      ...current,
      ...preferences
    });
  }

  static get() {
    return Storage.get(STORAGE_KEYS.USER_PREFERENCES);
  }

  static remove(key) {
    const current = UserPreferences.get() || {};
    delete current[key];
    Storage.set(STORAGE_KEYS.USER_PREFERENCES, current);
  }

  static clear() {
    Storage.remove(STORAGE_KEYS.USER_PREFERENCES);
  }
}

// Auth token management
class AuthToken {
  static set(token) {
    Storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static get() {
    return Storage.get(STORAGE_KEYS.AUTH_TOKEN);
  }

  static remove() {
    Storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }
}

export { Storage, Cache, UserPreferences, AuthToken };
