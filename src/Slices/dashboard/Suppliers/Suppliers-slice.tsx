import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  GetSuppliersApi,
  GetSupplierByIdApi,
  CreateSupplierApi,
  UpdateSupplierApi,
  DeleteSupplierApi,
  GetActiveSuppliersApi,
} from '../../../Api/ALL-api';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/api-middleware';

// Supplier interface
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

// Create Supplier Data interface
export interface CreateSupplierData {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
}

// Update Supplier Data interface
export interface UpdateSupplierData {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
}

// Response interfaces
export interface SuppliersListResponse {
  status: boolean;
  message: string;
  data: Supplier[];
}

export interface SupplierResponse {
  status: boolean;
  message: string;
  data: Supplier;
}

export interface DeleteSupplierResponse {
  status: boolean;
  message: string;
  data: boolean;
}

// State interface
interface SupplierState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
}

const initialState: SupplierState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  suppliers: [],
  selectedSupplier: null,
};

// Get all suppliers
export const getSuppliers = createAsyncThunk<
  SuppliersListResponse,
  void,
  { rejectValue: SuppliersListResponse }
>('suppliers/getSuppliers', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetSuppliersApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch suppliers. Please try again.',
      data: [],
    });
  }
});

// Get supplier by ID
export const getSupplierById = createAsyncThunk<
  SupplierResponse,
  string,
  { rejectValue: SupplierResponse }
>('suppliers/getSupplierById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetSupplierByIdApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch supplier. Please try again.',
      data: {} as Supplier,
    });
  }
});

// Get active suppliers
export const getActiveSuppliers = createAsyncThunk<
  SuppliersListResponse,
  void,
  { rejectValue: SuppliersListResponse }
>('suppliers/getActiveSuppliers', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetActiveSuppliersApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch active suppliers. Please try again.',
      data: [],
    });
  }
});

// Create supplier
export const createSupplier = createAsyncThunk<
  SupplierResponse,
  CreateSupplierData,
  { rejectValue: SupplierResponse }
>('suppliers/createSupplier', async (supplierData, { rejectWithValue }) => {
  try {
    const cleanedData = {
      name: supplierData.name,
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address,
      contactPerson: supplierData.contactPerson,
    };

    const response = await apiPost(CreateSupplierApi, cleanedData);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to create supplier. Please try again.',
      data: {} as Supplier,
    });
  }
});

// Update supplier
export const updateSupplier = createAsyncThunk<
  SupplierResponse,
  { id: string; data: UpdateSupplierData },
  { rejectValue: SupplierResponse }
>('suppliers/updateSupplier', async ({ id, data }, { rejectWithValue }) => {
  try {
    const cleanedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      contactPerson: data.contactPerson,
    };

    const response = await apiPut(UpdateSupplierApi(id), cleanedData);
    const responseData = await response.json();

    if (response.ok && responseData.status) {
      return responseData;
    } else {
      return rejectWithValue(responseData);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to update supplier. Please try again.',
      data: {} as Supplier,
    });
  }
});

// Delete supplier
export const deleteSupplier = createAsyncThunk<
  DeleteSupplierResponse,
  string,
  { rejectValue: DeleteSupplierResponse }
>('suppliers/deleteSupplier', async (id, { rejectWithValue }) => {
  try {
    const response = await apiDelete(DeleteSupplierApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to delete supplier. Please try again.',
      data: false,
    });
  }
});

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    resetSupplierState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearSuppliers: (state) => {
      state.suppliers = [];
    },
    setSelectedSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.selectedSupplier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Suppliers
      .addCase(getSuppliers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getSuppliers.fulfilled,
        (state, action: PayloadAction<SuppliersListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Suppliers loaded successfully!';
          state.errorMessage = '';
          state.suppliers = action.payload.data || [];
        }
      )
      .addCase(getSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load suppliers';
        state.suppliers = [];
      })
      // Get Supplier By ID
      .addCase(getSupplierById.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getSupplierById.fulfilled,
        (state, action: PayloadAction<SupplierResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Supplier loaded successfully!';
          state.errorMessage = '';
          state.selectedSupplier = action.payload.data;
        }
      )
      .addCase(getSupplierById.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load supplier';
        state.selectedSupplier = null;
      })
      // Get Active Suppliers
      .addCase(getActiveSuppliers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getActiveSuppliers.fulfilled,
        (state, action: PayloadAction<SuppliersListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Active suppliers loaded successfully!';
          state.errorMessage = '';
          state.suppliers = action.payload.data || [];
        }
      )
      .addCase(getActiveSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load active suppliers';
        state.suppliers = [];
      })
      // Create Supplier
      .addCase(createSupplier.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        createSupplier.fulfilled,
        (state, action: PayloadAction<SupplierResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Supplier created successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            state.suppliers.push(action.payload.data);
          }
        }
      )
      .addCase(createSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to create supplier';
      })
      // Update Supplier
      .addCase(updateSupplier.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateSupplier.fulfilled,
        (state, action: PayloadAction<SupplierResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Supplier updated successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            const index = state.suppliers.findIndex(
              (supplier) => supplier.id === action.payload.data.id
            );
            if (index !== -1) {
              state.suppliers[index] = action.payload.data;
            }
          }
        }
      )
      .addCase(updateSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update supplier';
      })
      // Delete Supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        deleteSupplier.fulfilled,
        (state, action: PayloadAction<DeleteSupplierResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Supplier deleted successfully!';
          state.errorMessage = '';
        }
      )
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to delete supplier';
      });
  },
});

export const { resetSupplierState, clearSuppliers, setSelectedSupplier } =
  suppliersSlice.actions;
export default suppliersSlice.reducer;

