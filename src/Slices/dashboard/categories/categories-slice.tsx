import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  GetProductCategoriesApi,
  CreateProductCategoryApi,
  UpdateProductCategoryApi,
  DeleteProductCategoryApi,
  GetProductSubCategoriesApi,
  GetProductSubCategoriesByCategoryApi,
  CreateProductSubCategoryApi,
  UpdateProductSubCategoryApi,
  DeleteProductSubCategoryApi,
} from '../../../Api/ALL-api';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/api-middleware';

// Category interfaces
export interface ProductCategory {
  id: string;
  name: string;
  subCategories?: ProductSubCategory[];
}

export interface ProductSubCategory {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
}

// Create Category Data
export interface CreateCategoryData {
  name: string;
}

// Create SubCategory Data
export interface CreateSubCategoryData {
  categoryId: string;
  name: string;
}

// Update Category Data
export interface UpdateCategoryData {
  id: string;
  data: CreateCategoryData;
}

// Update SubCategory Data
export interface UpdateSubCategoryData {
  id: string;
  data: CreateSubCategoryData;
}

// Response interfaces
export interface CategoriesListResponse {
  status: boolean;
  message: string;
  data: ProductCategory[];
}

export interface CategoryResponse {
  status: boolean;
  message: string;
  data: ProductCategory;
}

export interface SubCategoriesListResponse {
  status: boolean;
  message: string;
  data: ProductSubCategory[];
}

export interface SubCategoryResponse {
  status: boolean;
  message: string;
  data: ProductSubCategory;
}

// State interface
interface CategoriesState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  categories: ProductCategory[];
  subCategories: ProductSubCategory[];
}

const initialState: CategoriesState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  categories: [],
  subCategories: [],
};

// Get all categories
export const getCategories = createAsyncThunk<
  CategoriesListResponse,
  void,
  { rejectValue: CategoriesListResponse }
>('categories/getCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetProductCategoriesApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch categories. Please try again.',
      data: [],
    });
  }
});

// Create category
export const createCategory = createAsyncThunk<
  CategoryResponse,
  CreateCategoryData,
  { rejectValue: CategoryResponse }
>('categories/createCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await apiPost(CreateProductCategoryApi, categoryData);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to create category. Please try again.',
      data: {} as ProductCategory,
    });
  }
});

// Get all subcategories
export const getSubCategories = createAsyncThunk<
  SubCategoriesListResponse,
  void,
  { rejectValue: SubCategoriesListResponse }
>('categories/getSubCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetProductSubCategoriesApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch subcategories. Please try again.',
      data: [],
    });
  }
});

// Get subcategories by category ID
export const getSubCategoriesByCategory = createAsyncThunk<
  SubCategoriesListResponse,
  string,
  { rejectValue: SubCategoriesListResponse }
>('categories/getSubCategoriesByCategory', async (categoryId, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetProductSubCategoriesByCategoryApi(categoryId));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch subcategories. Please try again.',
      data: [],
    });
  }
});

// Create subcategory
export const createSubCategory = createAsyncThunk<
  SubCategoryResponse,
  CreateSubCategoryData,
  { rejectValue: SubCategoryResponse }
>('categories/createSubCategory', async (subCategoryData, { rejectWithValue }) => {
  try {
    const response = await apiPost(CreateProductSubCategoryApi, subCategoryData);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to create subcategory. Please try again.',
      data: {} as ProductSubCategory,
    });
  }
});

// Update category
export const updateCategory = createAsyncThunk<
  CategoryResponse,
  UpdateCategoryData,
  { rejectValue: CategoryResponse }
>('categories/updateCategory', async ({ id, data: categoryData }, { rejectWithValue }) => {
  try {
    const response = await apiPut(UpdateProductCategoryApi(id), categoryData);
    const responseData = await response.json();

    if (response.ok && responseData.status) {
      return responseData;
    } else {
      return rejectWithValue(responseData);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to update category. Please try again.',
      data: {} as ProductCategory,
    });
  }
});

// Delete category
export const deleteCategory = createAsyncThunk<
  { status: boolean; message: string; id: string },
  string,
  { rejectValue: { status: boolean; message: string; id: string } }
>('categories/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    const response = await apiDelete(DeleteProductCategoryApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return { ...data, id };
    } else {
      return rejectWithValue({ ...data, id });
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to delete category. Please try again.',
      id,
    });
  }
});

// Update subcategory
export const updateSubCategory = createAsyncThunk<
  SubCategoryResponse,
  UpdateSubCategoryData,
  { rejectValue: SubCategoryResponse }
>('categories/updateSubCategory', async ({ id, data: subCategoryData }, { rejectWithValue }) => {
  try {
    const response = await apiPut(UpdateProductSubCategoryApi(id), subCategoryData);
    const responseData = await response.json();

    if (response.ok && responseData.status) {
      return responseData;
    } else {
      return rejectWithValue(responseData);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to update subcategory. Please try again.',
      data: {} as ProductSubCategory,
    });
  }
});

// Delete subcategory
export const deleteSubCategory = createAsyncThunk<
  { status: boolean; message: string; id: string },
  string,
  { rejectValue: { status: boolean; message: string; id: string } }
>('categories/deleteSubCategory', async (id, { rejectWithValue }) => {
  try {
    const response = await apiDelete(DeleteProductSubCategoryApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return { ...data, id };
    } else {
      return rejectWithValue({ ...data, id });
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to delete subcategory. Please try again.',
      id,
    });
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoriesState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearCategories: (state) => {
      state.categories = [];
      state.subCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getCategories.fulfilled,
        (state, action: PayloadAction<CategoriesListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Categories loaded successfully!';
          state.errorMessage = '';
          state.categories = action.payload.data || [];
        }
      )
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load categories';
        state.categories = [];
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<CategoryResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Category created successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            state.categories.push(action.payload.data);
          }
        }
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to create category';
      })
      // Get SubCategories
      .addCase(getSubCategories.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getSubCategories.fulfilled,
        (state, action: PayloadAction<SubCategoriesListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Subcategories loaded successfully!';
          state.errorMessage = '';
          state.subCategories = action.payload.data || [];
        }
      )
      .addCase(getSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load subcategories';
        state.subCategories = [];
      })
      // Get SubCategories By Category
      .addCase(getSubCategoriesByCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getSubCategoriesByCategory.fulfilled,
        (state, action: PayloadAction<SubCategoriesListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Subcategories loaded successfully!';
          state.errorMessage = '';
          state.subCategories = action.payload.data || [];
        }
      )
      .addCase(getSubCategoriesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load subcategories';
        state.subCategories = [];
      })
      // Create SubCategory
      .addCase(createSubCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        createSubCategory.fulfilled,
        (state, action: PayloadAction<SubCategoryResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Subcategory created successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            state.subCategories.push(action.payload.data);
          }
        }
      )
      .addCase(createSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to create subcategory';
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<CategoryResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Category updated successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            const index = state.categories.findIndex(
              (cat) => cat.id === action.payload.data.id
            );
            if (index !== -1) {
              state.categories[index] = action.payload.data;
            }
          }
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update category';
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Category deleted successfully!';
        state.errorMessage = '';
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to delete category';
      })
      // Update SubCategory
      .addCase(updateSubCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateSubCategory.fulfilled,
        (state, action: PayloadAction<SubCategoryResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Subcategory updated successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            const index = state.subCategories.findIndex(
              (sub) => sub.id === action.payload.data.id
            );
            if (index !== -1) {
              state.subCategories[index] = action.payload.data;
            }
          }
        }
      )
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update subcategory';
      })
      // Delete SubCategory
      .addCase(deleteSubCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || 'Subcategory deleted successfully!';
        state.errorMessage = '';
        state.subCategories = state.subCategories.filter(
          (sub) => sub.id !== action.payload.id
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to delete subcategory';
      });
  },
});

export const { resetCategoriesState, clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;

