import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { GetProfileApi, UpdateProfileApi } from '../../../Api/ALL-api';

export interface ProfileData {
  username: string;
  email: string;
  language: string;
  phone: string;
  mobile: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  defaultStoreId: string;
  twoFactorEnabled: boolean;
  }

export interface SettingsResponse {
  status: boolean;
  message: string;
  data: ProfileData;
}

interface SettingsState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  profile: ProfileData | null;
}

const initialState: SettingsState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  profile: null,
};

// Get profile data
export const getProfile = createAsyncThunk<
  SettingsResponse,
  void,
  { rejectValue: SettingsResponse }
>(
  'settings/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(GetProfileApi, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to fetch profile. Please try again.',
        data: {
          username: '',
          email: '',
          language: '',
          phone: '',
          mobile: '',
          streetNumber: '',
          streetName: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          defaultStoreId: '',
          twoFactorEnabled: false,
        },
      });
    }
  }
);

// Update profile data
export const updateProfile = createAsyncThunk<
  SettingsResponse,
  ProfileData,
  { rejectValue: SettingsResponse }
>(
  'settings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(UpdateProfileApi, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to update profile. Please try again.',
        data: {
          username: '',
          email: '',
          language: '',
          phone: '',
          mobile: '',
          streetNumber: '',
          streetName: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          defaultStoreId: '',
          twoFactorEnabled: false,
              },
      });
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettingsState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<SettingsResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Profile loaded successfully!';
        state.errorMessage = '';
        state.profile = action.payload.data || null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to load profile';
        state.profile = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<SettingsResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Profile updated successfully!';
        state.errorMessage = '';
        state.profile = action.payload.data || null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to update profile';
      });
  },
});

export const { resetSettingsState, clearProfile } = settingsSlice.actions;
export default settingsSlice.reducer;

