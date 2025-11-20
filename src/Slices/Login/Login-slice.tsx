import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { LoginApi } from '../../Api/ALL-api';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  detail?: string;
  token?: string;
  data?: any;
}

interface LoginState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  token: string | null;
  user: any | null;
}

const initialState: LoginState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  token: null,
  user: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: LoginResponse }
>(
  'login/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch(LoginApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok && data.status) {
        // Store token and user data in localStorage
        if (data.data.token) {
          
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data || {}));
        }
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Login failed. Please try again.',
        detail: error.message || 'Login failed. Please try again.',
      });
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Login successful!';
        state.errorMessage = '';
        state.token = action.payload.token || null;
        state.user = action.payload.data || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.detail || action.payload?.message || 'Login failed. Please check your credentials.';
        state.token = null;
        state.user = null;
      });
  },
});

export const { resetLoginState, logout } = loginSlice.actions;
export default loginSlice.reducer;

