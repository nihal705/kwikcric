import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface GameState {
  currentGame: any;
  gameHistory: any[];
  leaderboard: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  currentGame: null,
  gameHistory: [],
  leaderboard: [],
  isLoading: false,
  error: null,
};

export const startQuickCricket = createAsyncThunk(
  'games/startQuickCricket',
  async (mode: string = 'classic') => {
    const response = await axios.post('/api/games/quick-cricket/start', { mode });
    return response.data.data;
  }
);

export const playQuickCricketShot = createAsyncThunk(
  'games/playQuickCricketShot',
  async ({ gameId, shotType }: { gameId: string; shotType: string }) => {
    const response = await axios.post('/api/games/quick-cricket/play', { gameId, shotType });
    return response.data.data;
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'games/fetchLeaderboard',
  async (gameType: string) => {
    const response = await axios.get(`/api/games/leaderboard/${gameType}`);
    return response.data.data;
  }
);

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startQuickCricket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startQuickCricket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(startQuickCricket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start game';
      })
      .addCase(playQuickCricketShot.fulfilled, (state, action) => {
        state.currentGame = action.payload.gameState;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });
  },
});

export const { clearCurrentGame } = gameSlice.actions;
export default gameSlice.reducer;