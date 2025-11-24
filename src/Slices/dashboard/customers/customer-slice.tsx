import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  GetCustomersApi,
  GetCustomerByIdApi,
  GetCustomersByStoreApi,
  CreateCustomerApi,
  UpdateCustomerApi,
} from '../../../Api/ALL-api';
import { apiGet, apiPost, apiPut } from '../../../utils/api-middleware';

// Address interface
export interface Address {
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
}

// Customer interface
export interface Customer {
  id: string;
  storeId: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  totalOrders: number;
  totalSpent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Create Customer Data interface
export interface CreateCustomerData {
  storeId: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

// Update Customer Data interface
export interface UpdateCustomerData {
  name: string;
  email: string;
  phone: string;
  address: Address;
  status: string;
}

// Response interfaces
export interface CustomersListResponse {
  status: boolean;
  message: string;
  data: Customer[];
}

export interface CustomerResponse {
  status: boolean;
  message: string;
  data: Customer;
}

// State interface
interface CustomerState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  customers: Customer[];
  selectedCustomer: Customer | null;
  selectedStoreId: string | null;
}

const initialState: CustomerState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  customers: [],
  selectedCustomer: null,
  selectedStoreId: null,
};

// Get all customers
export const getAllCustomers = createAsyncThunk<
  CustomersListResponse,
  void,
  { rejectValue: CustomersListResponse }
>('customer/getAllCustomers', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetCustomersApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch customers. Please try again.',
      data: [],
    });
  }
});

// Get customer by ID
export const getCustomerById = createAsyncThunk<
  CustomerResponse,
  string,
  { rejectValue: CustomerResponse }
>('customer/getCustomerById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetCustomerByIdApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch customer. Please try again.',
      data: {} as Customer,
    });
  }
});

// Get customers by store ID
export const getCustomersByStore = createAsyncThunk<
  CustomersListResponse,
  string,
  { rejectValue: CustomersListResponse }
>('customer/getCustomersByStore', async (storeId, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetCustomersByStoreApi(storeId));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch customers. Please try again.',
      data: [],
    });
  }
});

// Create customer
export const createCustomer = createAsyncThunk<
  CustomerResponse,
  CreateCustomerData,
  { rejectValue: CustomerResponse }
>('customer/createCustomer', async (customerData, { rejectWithValue }) => {
  try {
    const response = await apiPost(CreateCustomerApi, customerData);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to create customer. Please try again.',
      data: {} as Customer,
    });
  }
});

// Update customer
export const updateCustomer = createAsyncThunk<
  CustomerResponse,
  { id: string; data: UpdateCustomerData },
  { rejectValue: CustomerResponse }
>('customer/updateCustomer', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiPut(UpdateCustomerApi(id), data);
    const responseData = await response.json();

    if (response.ok && responseData.status) {
      return responseData;
    } else {
      return rejectWithValue(responseData);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to update customer. Please try again.',
      data: {} as Customer,
    });
  }
});

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearCustomers: (state) => {
      state.customers = [];
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setSelectedStoreId: (state, action: PayloadAction<string | null>) => {
      state.selectedStoreId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Customers
      .addCase(getAllCustomers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getAllCustomers.fulfilled,
        (state, action: PayloadAction<CustomersListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Customers loaded successfully!';
          state.errorMessage = '';
          state.customers = action.payload.data || [];
        }
      )
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load customers';
        state.customers = [];
      })
      // Get Customer By ID
      .addCase(getCustomerById.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getCustomerById.fulfilled,
        (state, action: PayloadAction<CustomerResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Customer loaded successfully!';
          state.errorMessage = '';
          state.selectedCustomer = action.payload.data || null;
          // Update customer in list if exists
          if (action.payload.data) {
            const index = state.customers.findIndex(
              (cust) => cust.id === action.payload.data.id
            );
            if (index !== -1) {
              state.customers[index] = action.payload.data;
            }
          }
        }
      )
      .addCase(getCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load customer';
        state.selectedCustomer = null;
      })
      // Get Customers By Store
      .addCase(getCustomersByStore.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getCustomersByStore.fulfilled,
        (state, action: PayloadAction<CustomersListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Customers loaded successfully!';
          state.errorMessage = '';
          state.customers = action.payload.data || [];
          state.selectedStoreId = state.selectedStoreId;
        }
      )
      .addCase(getCustomersByStore.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load customers';
        state.customers = [];
      })
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        createCustomer.fulfilled,
        (state, action: PayloadAction<CustomerResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Customer created successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            state.customers.push(action.payload.data);
          }
        }
      )
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to create customer';
      })
      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateCustomer.fulfilled,
        (state, action: PayloadAction<CustomerResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Customer updated successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            const index = state.customers.findIndex(
              (cust) => cust.id === action.payload.data.id
            );
            if (index !== -1) {
              state.customers[index] = action.payload.data;
            }
            // Update selected customer if it's the one being updated
            if (state.selectedCustomer?.id === action.payload.data.id) {
              state.selectedCustomer = action.payload.data;
            }
          }
        }
      )
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update customer';
      });
  },
});

export const {
  resetCustomerState,
  clearCustomers,
  setSelectedCustomer,
  setSelectedStoreId,
} = customerSlice.actions;
export default customerSlice.reducer;


