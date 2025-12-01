import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  GetProductsApi,
  GetProductByIdApi,
  CreateProductApi,
  UpdateProductApi,
  DeleteProductApi,
  SearchProductsApi,
} from '../../../Api/ALL-api';
import { apiGet, apiPost, apiPut, apiDelete, apiPostFile } from '../../../utils/api-middleware';

// Product Variant interface
export interface ProductVariant {
  id: string;
  productId: string;
  attributeName: string;
  attributeValue: string;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  costPrice: number;
  salePrice: number;
  productType: string;
  trackSerials: boolean;
  isActive: boolean;
  supplierId: string;
  supplierName: string;
  condition: string;
  inventoryValuationMethod: string;
  minimumPrice: number;
  taxClass: string;
  showOnPOS: boolean;
  upcCode: string;
  variants: ProductVariant[];
  profitMargin: number;
  profitAmount: number;
  createdAt: string;
}

// Create Product Data interface
export interface CreateProductData {
  name: string;
  sku: string;
  brand: string;
  description: string;
  categoryId: string | null;
  subCategoryId: string | null;
  costPrice: number;
  salePrice: number;
  productType: number;
  trackSerials: boolean;
  supplierId: string | null;
  condition: string;
  inventoryValuationMethod: string;
  minimumPrice: number;
  taxClass: string;
  showOnPOS: boolean;
  onHandQty: number;
  stockWarning: number;
  reorderLevel: number;
  warrantyDays: number;
  upcCode: string;
  variants?: ProductVariant[];
  imageFile?: File | null;
}

// Update Product Data interface
export interface UpdateProductData {
  name: string;
  sku: string;
  brand: string;
  description: string;
  categoryId: string | null;
  subCategoryId: string | null;
  costPrice: number;
  salePrice: number;
  productType: number;
  trackSerials: boolean;
  supplierId: string | null;
  condition: string;
  inventoryValuationMethod: string;
  minimumPrice: number;
  taxClass: string;
  showOnPOS: boolean;
  onHandQty: number;
  stockWarning: number;
  reorderLevel: number;
  warrantyDays: number;
  upcCode: string;
  variants?: ProductVariant[];
  isActive?: boolean;
}

// Response interfaces
export interface ProductsListResponse {
  status: boolean;
  message: string;
  data: Product[];
}

export interface ProductResponse {
  status: boolean;
  message: string;
  data: Product;
}

export interface DeleteProductResponse {
  status: boolean;
  message: string;
  data: boolean;
}

// State interface
interface ProductState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
  products: Product[];
  selectedProduct: Product | null;
}

const initialState: ProductState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: '',
  products: [],
  selectedProduct: null,
};

// Get all products
export const getProducts = createAsyncThunk<
  ProductsListResponse,
  void,
  { rejectValue: ProductsListResponse }
>('products/getProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetProductsApi);
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch products. Please try again.',
      data: [],
    });
  }
});

// Get product by ID
export const getProductById = createAsyncThunk<
  ProductResponse,
  string,
  { rejectValue: ProductResponse }
>('products/getProductById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiGet(GetProductByIdApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to fetch product. Please try again.',
      data: {} as Product,
    });
  }
});

// Search products
export const searchProducts = createAsyncThunk<
  ProductsListResponse,
  string,
  { rejectValue: ProductsListResponse }
>('products/searchProducts', async (searchTerm, { rejectWithValue }) => {
  try {
    const response = await apiGet(SearchProductsApi(searchTerm));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to search products. Please try again.',
      data: [],
    });
  }
});

// Create product
export const createProduct = createAsyncThunk<
  ProductResponse,
  CreateProductData,
  { rejectValue: ProductResponse }
>('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    // If image is provided, use FormData; otherwise use JSON
    if (productData.imageFile) {
      const formData = new FormData();
      
      // Add all product fields to FormData
      formData.append('name', productData.name);
      formData.append('sku', productData.sku);
      formData.append('brand', productData.brand || '');
      formData.append('description', productData.description || '');
      if (productData.categoryId) {
        formData.append('categoryId', productData.categoryId);
      }
      if (productData.subCategoryId) {
        formData.append('subCategoryId', productData.subCategoryId);
      }
      formData.append('costPrice', productData.costPrice.toString());
      formData.append('salePrice', productData.salePrice.toString());
      formData.append('productType', productData.productType.toString());
      formData.append('trackSerials', productData.trackSerials.toString());
      if (productData.supplierId) {
        formData.append('supplierId', productData.supplierId);
      }
      formData.append('condition', productData.condition || '');
      formData.append('inventoryValuationMethod', productData.inventoryValuationMethod || '');
      formData.append('minimumPrice', productData.minimumPrice.toString());
      formData.append('taxClass', productData.taxClass || '');
      formData.append('showOnPOS', productData.showOnPOS.toString());
      formData.append('onHandQty', productData.onHandQty.toString());
      formData.append('stockWarning', productData.stockWarning.toString());
      formData.append('reorderLevel', productData.reorderLevel.toString());
      formData.append('warrantyDays', productData.warrantyDays.toString());
      formData.append('upcCode', productData.upcCode || '');
      
      // Add image file
      formData.append('image', productData.imageFile);
      
      // Add variants if they exist
      if (productData.variants && productData.variants.length > 0) {
        formData.append('variants', JSON.stringify(productData.variants));
      }
      
      const response = await apiPostFile(CreateProductApi, formData);
      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } else {
      // Clean up the data: ensure GUID fields are null if empty, and remove undefined values
      const cleanedData: any = {
        name: productData.name,
        sku: productData.sku,
        brand: productData.brand || '',
        description: productData.description || '',
        categoryId: productData.categoryId || null,
        subCategoryId: productData.subCategoryId || null,
        costPrice: productData.costPrice,
        salePrice: productData.salePrice,
        productType: productData.productType,
        trackSerials: productData.trackSerials,
        supplierId: productData.supplierId || null,
        condition: productData.condition || '',
        inventoryValuationMethod: productData.inventoryValuationMethod || '',
        minimumPrice: productData.minimumPrice,
        taxClass: productData.taxClass || '',
        showOnPOS: productData.showOnPOS,
        onHandQty: productData.onHandQty,
        stockWarning: productData.stockWarning,
        reorderLevel: productData.reorderLevel,
        warrantyDays: productData.warrantyDays,
        upcCode: productData.upcCode || '',
      };
      
      // Only include variants if they exist
      if (productData.variants && productData.variants.length > 0) {
        cleanedData.variants = productData.variants;
      }
      
      const response = await apiPost(CreateProductApi, cleanedData);
      const data = await response.json();

      if (response.ok && data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to create product. Please try again.',
      data: {} as Product,
    });
  }
});

// Update product
export const updateProduct = createAsyncThunk<
  ProductResponse,
  { id: string; data: UpdateProductData },
  { rejectValue: ProductResponse }
>('products/updateProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    // Clean up the data: ensure GUID fields are null if empty, and remove undefined values
    const cleanedData: any = {
      name: data.name,
      sku: data.sku,
      brand: data.brand || '',
      description: data.description || '',
      categoryId: data.categoryId || null,
      subCategoryId: data.subCategoryId || null,
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      productType: data.productType,
      trackSerials: data.trackSerials,
      supplierId: data.supplierId || null,
      condition: data.condition || '',
      inventoryValuationMethod: data.inventoryValuationMethod || '',
      minimumPrice: data.minimumPrice,
      taxClass: data.taxClass || '',
      showOnPOS: data.showOnPOS,
      onHandQty: data.onHandQty,
      stockWarning: data.stockWarning,
      reorderLevel: data.reorderLevel,
      warrantyDays: data.warrantyDays,
      upcCode: data.upcCode || '',
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };
    
    // Only include variants if they exist
    if (data.variants && data.variants.length > 0) {
      cleanedData.variants = data.variants;
    }
    
    const response = await apiPut(UpdateProductApi(id), cleanedData);
    const responseData = await response.json();

    if (response.ok && responseData.status) {
      return responseData;
    } else {
      return rejectWithValue(responseData);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to update product. Please try again.',
      data: {} as Product,
    });
  }
});

// Delete product
export const deleteProduct = createAsyncThunk<
  DeleteProductResponse,
  string,
  { rejectValue: DeleteProductResponse }
>('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    const response = await apiDelete(DeleteProductApi(id));
    const data = await response.json();

    if (response.ok && data.status) {
      return data;
    } else {
      return rejectWithValue(data);
    }
  } catch (error: any) {
    return rejectWithValue({
      status: false,
      message: error.message || 'Failed to delete product. Please try again.',
      data: false,
    });
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearProducts: (state) => {
      state.products = [];
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<ProductsListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Products loaded successfully!';
          state.errorMessage = '';
          state.products = action.payload.data || [];
        }
      )
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load products';
        state.products = [];
      })
      // Get Product By ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        getProductById.fulfilled,
        (state, action: PayloadAction<ProductResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Product loaded successfully!';
          state.errorMessage = '';
          state.selectedProduct = action.payload.data;
        }
      )
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to load product';
        state.selectedProduct = null;
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        searchProducts.fulfilled,
        (state, action: PayloadAction<ProductsListResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Search completed successfully!';
          state.errorMessage = '';
          state.products = action.payload.data || [];
        }
      )
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to search products';
        state.products = [];
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<ProductResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Product created successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            state.products.push(action.payload.data);
          }
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to create product';
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<ProductResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Product updated successfully!';
          state.errorMessage = '';
          if (action.payload.data) {
            const index = state.products.findIndex(
              (prod) => prod.id === action.payload.data.id
            );
            if (index !== -1) {
              state.products[index] = action.payload.data;
            }
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage =
          action.payload?.message || 'Failed to update product';
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<DeleteProductResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message || 'Product deleted successfully!';
          state.errorMessage = '';
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload?.message || 'Failed to delete product';
      });
  },
});

export const { resetProductState, clearProducts, setSelectedProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
