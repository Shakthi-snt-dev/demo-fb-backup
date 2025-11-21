import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  GetStoresListApi,
  GetEmployeesByStoreApi,
  CreateEmployeeApi,
  UpdateEmployeeApi,
  DeleteEmployeeApi,
} from '../../../Api/ALL-api';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/api-middleware';

// Address interface
export interface Address {
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
}

// Permissions interface
export interface Permissions {
  [key: string]: boolean;
}

// Employee interface
export interface Employee {
  id: string;
  storeId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  employeeCode: string;
  hourlyRate: number;
  address: Address;
  emergencyContactName: string;
  emergencyContactPhone: string;
  linkedAppUserId: string;
  isActive: boolean;
  permissions: Permissions;
  createdAt: string;
  updatedAt: string;
}

// Store interface
export interface Store {
  id: string;
  storeName: string;
}

// Create Employee Data interface
export interface CreateEmployeeData {
  storeId: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  employeeCode: string;
  hourlyRate: number;
  address: Address;
  emergencyContactName: string;
  emergencyContactPhone: string;
  linkedAppUserId?: string;
  permissions: Permissions;
}

// Update Employee Data interface
export interface UpdateEmployeeData {
  fullName: string;
  phone: string;
  role: string;
  hourlyRate: number;
  address: Address;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isActive: boolean;
  permissions: Permissions;
}

// Response interfaces
export interface StoresListResponse {
  status: boolean;
  message: string;
  data: Store[];
}

export interface EmployeesListResponse {
  status: boolean;
  message: string;
  data: Employee[];
}

export interface EmployeeResponse {
  status: boolean;
  message: string;
  data: Employee;
}

export interface DeleteEmployeeResponse {
  status: boolean;
  message: string;
  data: boolean;
}

// State interface
interface EmployeeState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  employees: Employee[];
  stores: Store[];
  selectedStoreId: string | null;
}

const initialState: EmployeeState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  employees: [],
  stores: [],
  selectedStoreId: null,
};

// Get stores list
export const getStoresList = createAsyncThunk<
  StoresListResponse,
  void,
  { rejectValue: StoresListResponse }
>('employee/getStoresList', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetStoresListApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch stores. Please try again.',
      data: [],
    });
  }
});

// Get employees by store
export const getEmployeesByStore = createAsyncThunk<
  EmployeesListResponse,
  { storeId: string; role?: string },
  { rejectValue: EmployeesListResponse }
>('employee/getEmployeesByStore', async ({ storeId, role }, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetEmployeesByStoreApi(storeId, role));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch employees. Please try again.',
      data: [],
    });
  }
});

// Create employee
export const createEmployee = createAsyncThunk<
  EmployeeResponse,
  CreateEmployeeData,
  { rejectValue: EmployeeResponse }
>('employee/createEmployee', async (employeeData, { rejectWithValue }) => {
  try {
    const response = await apiPost(CreateEmployeeApi, employeeData);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to create employee. Please try again.',
      data: {} as Employee,
    });
  }
});

// Update employee
export const updateEmployee = createAsyncThunk<
  EmployeeResponse,
  { id: string; data: UpdateEmployeeData },
  { rejectValue: EmployeeResponse }
>('employee/updateEmployee', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiPut(UpdateEmployeeApi(id), data);
    const responseData = await response.json();

    if (response.ok && responseData.status) {
      return responseData;
    } else {
      return rejectWithValue(responseData);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to update employee. Please try again.',
      data: {} as Employee,
    });
  }
});

// Delete employee
export const deleteEmployee = createAsyncThunk<
  DeleteEmployeeResponse,
  string,
  { rejectValue: DeleteEmployeeResponse }
>('employee/deleteEmployee', async (id, { rejectWithValue }) => {
  try {
    const response = await apiDelete(DeleteEmployeeApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to delete employee. Please try again.',
      data: false,
    });
  }
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearEmployees: (state) => {
      state.employees = [];
    },
    setSelectedStoreId: (state, action: PayloadAction<string | null>) => {
      state.selectedStoreId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Stores List
      .addCase(getStoresList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getStoresList.fulfilled,
        (state, action: PayloadAction<StoresListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Stores loaded successfully!';
          state.errorMessage = '';
          state.stores = action.payload.data || [];
        }
      )
      .addCase(getStoresList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load stores';
        state.stores = [];
      })
      // Get Employees By Store
      .addCase(getEmployeesByStore.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getEmployeesByStore.fulfilled,
        (state, action: PayloadAction<EmployeesListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Employees loaded successfully!';
          state.errorMessage = '';
          state.employees = action.payload.data || [];
        }
      )
      .addCase(getEmployeesByStore.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load employees';
        state.employees = [];
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<EmployeeResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Employee created successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            state.employees.push(action.payload.data);
          }
        }
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to create employee';
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<EmployeeResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Employee updated successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            const index = state.employees.findIndex(
              (emp) => emp.id === action.payload.data.id
            );
            if (index !== -1) {
              state.employees[index] = action.payload.data;
            }
          }
        }
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update employee';
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<DeleteEmployeeResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Employee deleted successfully!';
          state.errorMessage = '';
        }
      )
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to delete employee';
      });
  },
});

export const { resetEmployeeState, clearEmployees, setSelectedStoreId } =
  employeeSlice.actions;
export default employeeSlice.reducer;

