const BASE_URL = "http://localhost:5113/api";

export const RegisterApi = `${BASE_URL}/auth/register`;
export const LoginApi = `${BASE_URL}/auth/login`;
export const VerifyEmailApi = `${BASE_URL}/auth/verify-email`;

// Settings API
export const GetProfileApi = `${BASE_URL}/profile`;
export const UpdateProfileApi = `${BASE_URL}/profile`;

// Security API
export const UpdatePasswordApi = `${BASE_URL}/Settings/change-password`;

// Store Settings API
export const GetStoreSettingsApi = (storeId: string) => `${BASE_URL}/StoreSettings/stores/${storeId}`;
export const UpdateStoreSettingsApi = (storeId: string) => `${BASE_URL}/StoreSettings/stores/${storeId}`;
export const ResetApiKeyApi = (storeId: string) => `${BASE_URL}/StoreSettings/stores/${storeId}/reset-api-key`;
export const SendVerificationEmailApi = (storeId: string) => `${BASE_URL}/StoreSettings/stores/${storeId}/send-verification-email`;
export const VerifyStoreEmailApi = (storeId: string) => `${BASE_URL}/StoreSettings/stores/${storeId}/verify-email`;

// Stores API
export const GetStoresListApi = `${BASE_URL}/Stores/list`;

// Employees API
export const GetEmployeesByStoreApi = (storeId: string, role?: string) => {
  const url = `${BASE_URL}/Employees/store/${storeId}`;
  return role && role !== 'all' ? `${url}?role=${role}` : url;
};
export const CreateEmployeeApi = `${BASE_URL}/Employees`;
export const UpdateEmployeeApi = (id: string) => `${BASE_URL}/Employees/${id}`;
export const DeleteEmployeeApi = (id: string) => `${BASE_URL}/Employees/${id}`;

// Customers API
export const GetCustomersApi = `${BASE_URL}/Customers`;
export const GetCustomerByIdApi = (id: string) => `${BASE_URL}/Customers/${id}`;
export const GetCustomersByStoreApi = (storeId: string) => `${BASE_URL}/Customers/store/${storeId}`;
export const CreateCustomerApi = `${BASE_URL}/Customers`;
export const UpdateCustomerApi = (id: string) => `${BASE_URL}/Customers/${id}`;

// Products API
export const GetProductsApi = `${BASE_URL}/Products`;
export const GetProductByIdApi = (id: string) => `${BASE_URL}/Products/${id}`;
export const CreateProductApi = `${BASE_URL}/Products`;
export const UpdateProductApi = (id: string) => `${BASE_URL}/Products/${id}`;
export const DeleteProductApi = (id: string) => `${BASE_URL}/Products/${id}`;
export const SearchProductsApi = (searchTerm: string) => `${BASE_URL}/Products/Search?searchTerm=${encodeURIComponent(searchTerm)}`;

// Product Categories API
export const GetProductCategoriesApi = `${BASE_URL}/ProductCategories`;
export const CreateProductCategoryApi = `${BASE_URL}/ProductCategories`;
export const UpdateProductCategoryApi = (id: string) => `${BASE_URL}/ProductCategories/${id}`;
export const DeleteProductCategoryApi = (id: string) => `${BASE_URL}/ProductCategories/${id}`;

// Product SubCategories API
export const GetProductSubCategoriesApi = `${BASE_URL}/ProductSubCategories`;
export const GetProductSubCategoriesByCategoryApi = (categoryId: string) => `${BASE_URL}/ProductSubCategories/category/${categoryId}`;
export const CreateProductSubCategoryApi = `${BASE_URL}/ProductSubCategories`;
export const UpdateProductSubCategoryApi = (id: string) => `${BASE_URL}/ProductSubCategories/${id}`;
export const DeleteProductSubCategoryApi = (id: string) => `${BASE_URL}/ProductSubCategories/${id}`;

// Suppliers API
export const GetSuppliersApi = `${BASE_URL}/Suppliers`;
export const GetSupplierByIdApi = (id: string) => `${BASE_URL}/Suppliers/${id}`;
export const CreateSupplierApi = `${BASE_URL}/Suppliers`;
export const UpdateSupplierApi = (id: string) => `${BASE_URL}/Suppliers/${id}`;
export const DeleteSupplierApi = (id: string) => `${BASE_URL}/Suppliers/${id}`;
export const GetActiveSuppliersApi = `${BASE_URL}/Suppliers/active`;