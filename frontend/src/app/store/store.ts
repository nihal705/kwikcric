import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import playerReducer from './slices/playerSlice';
import tournamentReducer from './slices/tournamentSlice';
import gameReducer from './slices/gameSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    players: playerReducer,
    tournaments: tournamentReducer,
    games: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;