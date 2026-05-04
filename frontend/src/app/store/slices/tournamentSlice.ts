import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Tournament {
  id: number;
  name: string;
  year: number;
  winner?: string;
}

interface TournamentState {
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  iplData: any;
  worldCupData: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: TournamentState = {
  tournaments: [],
  selectedTournament: null,
  iplData: null,
  worldCupData: null,
  isLoading: false,
  error: null,
};

export const fetchIPLByYear = createAsyncThunk(
  'tournaments/fetchIPLByYear',
  async (year: number) => {
    const response = await axios.get(`/api/tournaments/ipl/${year}`);
    return response.data.data;
  }
);

export const fetchWorldCupByYear = createAsyncThunk(
  'tournaments/fetchWorldCupByYear',
  async (year: number) => {
    const response = await axios.get(`/api/tournaments/world-cup/${year}`);
    return response.data.data;
  }
);

const tournamentSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    clearTournamentData: (state) => {
      state.iplData = null;
      state.worldCupData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIPLByYear.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIPLByYear.fulfilled, (state, action) => {
        state.isLoading = false;
        state.iplData = action.payload;
      })
      .addCase(fetchIPLByYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch IPL data';
      })
      .addCase(fetchWorldCupByYear.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorldCupByYear.fulfilled, (state, action) => {
        state.isLoading = false;
        state.worldCupData = action.payload;
      })
      .addCase(fetchWorldCupByYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch World Cup data';
      });
  },
});

export const { clearTournamentData } = tournamentSlice.actions;
export default tournamentSlice.reducer;