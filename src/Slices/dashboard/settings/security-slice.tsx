import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { UpdatePasswordApi } from '../../../Api/ALL-api';

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecurityResponse {
  status: boolean;
  message: string;
  data?: any;
}

interface SecurityState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
}

const initialState: SecurityState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
};

// Update password
export const updatePassword = createAsyncThunk<
  SecurityResponse,
  PasswordUpdateData,
  { rejectValue: SecurityResponse }
>(
  'security/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(UpdatePasswordApi, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
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
        message: error.message || 'Failed to update password. Please try again.',
      });
    }
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    resetSecurityState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(updatePassword.fulfilled, (state, action: PayloadAction<SecurityResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Password updated successfully!';
        state.errorMessage = '';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to update password';
      });
  },
});

export const { resetSecurityState } = securitySlice.actions;
export default securitySlice.reducer;

