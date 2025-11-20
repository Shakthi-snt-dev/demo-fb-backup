import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  GetStoreSettingsApi,
  UpdateStoreSettingsApi,
  ResetApiKeyApi,
  SendVerificationEmailApi,
  VerifyStoreEmailApi,
} from '../../../Api/ALL-api';
import { apiGet, apiPut, apiPost } from '../../../utils/api-middleware';

// Address interface
export interface Address {
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
}

// Store Settings Data interface
export interface StoreSettingsData {
  businessName: string;
  storeEmail: string;
  alternateName: string;
  storeLogoUrl: string;
  phone: string;
  mobile: string;
  website: string;
  address: Address;
  timeZone: string;
  timeFormat: string;
  language: string;
  defaultCurrency: string;
  priceFormat: string;
  decimalFormat: string;
  chargeSalesTax: boolean;
  defaultTaxClass: string;
  taxPercentage: number;
  registrationNumber: string;
  startTime: string;
  endTime: string;
  defaultAddress: Address;
  apiKey: string;
  accountingMethod: string;
  companyEmail: string;
  companyEmailVerified: boolean;
  emailNotifications: boolean;
  requireTwoFactorForAllUsers: boolean;
  chargeRestockingFee: boolean;
  diagnosticBenchFee: number;
  chargeDepositOnRepairs: boolean;
  lockScreenTimeoutMinutes: number;
}

// Response interfaces
export interface StoreSettingsResponse {
  status: boolean;
  message: string;
  data: StoreSettingsData;
}

export interface VerifyEmailResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface ResetApiKeyResponse {
  status: boolean;
  message: string;
  data?: {
    apiKey: string;
  };
}

// State interface
interface StoreSettingsState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  storeSettings: StoreSettingsData | null;
  storeId: string | null;
}

const initialState: StoreSettingsState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  storeSettings: null,
  storeId: null,
};

// Get store settings
export const getStoreSettings = createAsyncThunk<
  StoreSettingsResponse,
  string,
  { rejectValue: StoreSettingsResponse }
>(
  'storeSettings/getStoreSettings',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await apiGet(GetStoreSettingsApi(storeId));
      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to fetch store settings. Please try again.',
        data: {} as StoreSettingsData,
      });
    }
  }
);

// Update store settings
export const updateStoreSettings = createAsyncThunk<
  StoreSettingsResponse,
  { storeId: string; data: StoreSettingsData },
  { rejectValue: StoreSettingsResponse }
>(
  'storeSettings/updateStoreSettings',
  async ({ storeId, data }, { rejectWithValue }) => {
    try {
      const response = await apiPut(UpdateStoreSettingsApi(storeId), data);
      const responseData = await response.json();

      if (response.ok && responseData.status) {
        return responseData;
      } else {
        return rejectWithValue(responseData);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to update store settings. Please try again.',
        data: {} as StoreSettingsData,
      });
    }
  }
);

// Send verification email
export const sendVerificationEmail = createAsyncThunk<
  VerifyEmailResponse,
  { storeId: string; email?: string },
  { rejectValue: VerifyEmailResponse }
>(
  'storeSettings/sendVerificationEmail',
  async ({ storeId, email }, { rejectWithValue }) => {
    try {
      const response = await apiPost(
        SendVerificationEmailApi(storeId),
        email ? { email } : undefined
      );
      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to send verification email. Please try again.',
      });
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  { storeId: string; token?: string },
  { rejectValue: VerifyEmailResponse }
>(
  'storeSettings/verifyEmail',
  async ({ storeId, token }, { rejectWithValue }) => {
    try {
      const response = await apiPost(
        VerifyStoreEmailApi(storeId),
        token ? { token } : undefined
      );
      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to verify email. Please try again.',
      });
    }
  }
);

// Reset API key
export const resetApiKey = createAsyncThunk<
  ResetApiKeyResponse,
  string,
  { rejectValue: ResetApiKeyResponse }
>(
  'storeSettings/resetApiKey',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await apiPost(ResetApiKeyApi(storeId));
      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error: any) {
      return rejectWithValue({
        status: false,
        message: error.message || 'Failed to reset API key. Please try again.',
      });
    }
  }
);

const storeSettingsSlice = createSlice({
  name: 'storeSettings',
  initialState,
  reducers: {
    resetStoreSettingsState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearStoreSettings: (state) => {
      state.storeSettings = null;
    },
    setStoreId: (state, action: PayloadAction<string>) => {
      state.storeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Store Settings
      .addCase(getStoreSettings.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getStoreSettings.fulfilled,
        (state, action: PayloadAction<StoreSettingsResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Store settings loaded successfully!';
          state.errorMessage = '';
          state.storeSettings = action.payload.data || null;
        }
      )
      .addCase(getStoreSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load store settings';
        state.storeSettings = null;
      })
      // Update Store Settings
      .addCase(updateStoreSettings.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateStoreSettings.fulfilled,
        (state, action: PayloadAction<StoreSettingsResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Store settings updated successfully!';
          state.errorMessage = '';
          state.storeSettings = action.payload.data || state.storeSettings;
        }
      )
      .addCase(updateStoreSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update store settings';
      })
      // Send Verification Email
      .addCase(sendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        sendVerificationEmail.fulfilled,
        (state, action: PayloadAction<VerifyEmailResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Verification email sent successfully!';
          state.errorMessage = '';
        }
      )
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to send verification email';
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        verifyEmail.fulfilled,
        (state, action: PayloadAction<VerifyEmailResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Email verified successfully!';
          state.errorMessage = '';
          // Update companyEmailVerified if storeSettings exists
          if (state.storeSettings) {
            state.storeSettings.companyEmailVerified = true;
          }
        }
      )
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to verify email';
      })
      // Reset API Key
      .addCase(resetApiKey.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        resetApiKey.fulfilled,
        (state, action: PayloadAction<ResetApiKeyResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'API key reset successfully!';
          state.errorMessage = '';
          // Update apiKey if storeSettings exists
          if (state.storeSettings && action.payload.data?.apiKey) {
            state.storeSettings.apiKey = action.payload.data.apiKey;
          }
        }
      )
      .addCase(resetApiKey.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to reset API key';
      });
  },
});

export const { resetStoreSettingsState, clearStoreSettings, setStoreId } =
  storeSettingsSlice.actions;
export default storeSettingsSlice.reducer;

