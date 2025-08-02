import { configureStore } from '@reduxjs/toolkit'
import adminReducer from './slices/adminSlice'
import usersReducer from './slices/usersSlice'
import subscriptionsReducer from './slices/subscriptionsSlice'
import habitsReducer from './slices/habitsSlice'
import logsReducer from './slices/logsSlice'
import settingsReducer from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    users: usersReducer,
    subscriptions: subscriptionsReducer,
    habits: habitsReducer,
    logs: logsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Export types for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch