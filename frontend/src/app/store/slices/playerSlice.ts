import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Player {
  id: number;
  name: string;
  country: string;
  role: string;
  runs: number;
  wickets: number;
}

interface PlayerState {
  players: Player[];
  selectedPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  players: [],
  selectedPlayer: null,
  isLoading: false,
  error: null,
};

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async () => {
    const response = await axios.get('/api/players');
    return response.data.data;
  }
);

export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (id: number) => {
    const response = await axios.get(`/api/players/${id}`);
    return response.data.data;
  }
);

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    clearSelectedPlayer: (state) => {
      state.selectedPlayer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch players';
      })
      .addCase(fetchPlayerById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPlayer = action.payload;
      })
      .addCase(fetchPlayerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch player';
      });
  },
});

export const { clearSelectedPlayer } = playerSlice.actions;
export default playerSlice.reducer;