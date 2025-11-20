import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { RegisterApi, VerifyEmailApi } from '../../Api/ALL-api';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  detail?: string;
  data?: any;
}

interface RegisterState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  data: any | null;
}

const initialState: RegisterState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  data: null,
};

export const registerUser = createAsyncThunk<RegisterResponse,RegisterData,
  { rejectValue: RegisterResponse }
>(
  'register/registerUser',

  async (registerData, { rejectWithValue }) => {
    try {
      const response = await fetch(RegisterApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
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
        message: error.message || 'Registration failed. Please try again.',
        detail: error.message || 'Registration failed. Please try again.',
      });
    }
  }
);

export const verifyEmail = createAsyncThunk<RegisterResponse, string,
  { rejectValue: RegisterResponse }
>(
  'register/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${VerifyEmailApi}?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        message: error.message || 'Email verification failed. Please try again.',
        detail: error.message || 'Email verification failed. Please try again.',
      });
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Registration successful! Please check your email to verify your account.';
        state.errorMessage = '';
        state.data = action.payload.data || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.detail || action.payload?.message || 'Registration failed';
        state.data = null;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Email verified successfully!';
        state.errorMessage = '';
        state.data = action.payload.data || null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.detail || action.payload?.message || 'Email verification failed';
        state.data = null;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;

