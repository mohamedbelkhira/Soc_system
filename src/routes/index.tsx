import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LoadingBar from "@/components/Layout/LoadingBar.js";
import { useAuth } from "@/contexts/auth-provider";

const Layout = lazy(() => import("@/layouts/layout.js"));
// Lazy load pages
const LoginPage = lazy(() => import("@/pages/LoginPage.js"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage.js"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.js"));
const CommonCompnentsPage = lazy(() => import("@/pages/CommonComponentsPage"));

// Roles
const RolesPage = lazy(() => import("@/pages/roles/RolesPage"));
const CreateRolePage = lazy(() => import("@/pages/roles/create/CreateRolePage"));
const UpdateRolePage = lazy(() => import("@/pages/roles/update/UpdateRolePage"));

// Products & Categories
const CategoriesPage = lazy(() =>
  import("@/pages/products/category/main/CategoriesPage")
);
const AttributesPage = lazy(() =>
  import("@/pages/products/attribute/main/AttributesPage")
);
const ProductsPage = lazy(() =>
  import("@/pages/products/product/main/ProductsPage")
);
const CreateProductPage = lazy(() =>
  import("@/pages/products/product/create/CreateProductPage")
);
const ProductDetailsPage = lazy(() =>
  import("@/pages/products/product/details/product/ProductDetailsPage")
);
const UpdateProductPage = lazy(() =>
  import("@/pages/products/product/update/product/UpdateProductPage")
);

// Purchases
const PurchasesPage = lazy(() => import("@/pages/Purchase/main/PurchasePage"));
const CreatePurchasePage = lazy(() =>
  import("@/pages/Purchase/create/CreatePurchasePage")
);
const PurchaseDetailsPage = lazy(() =>
  import("@/pages/Purchase/detail/PurchaseDetailsPage")
);
const UpdatePurchasePage = lazy(() =>
  import("@/pages/Purchase/update/UpdatePurchasePage")
);

// Sales - Store
const StoreSalesPage = lazy(() =>
  import("@/pages/sales/store-sale/main/StoreSalesPage")
);
const CreateStoreSalePage = lazy(() =>
  import("@/pages/sales/store-sale/create/CreateStoreSalePage")
);
const StoreSaleDetailsPage = lazy(() =>
  import("@/pages/sales/store-sale/details/StoreSaleDetailsPage")
);
const UpdateStoreSalePage = lazy(() =>
  import("@/pages/sales/store-sale/update/UpdateStoreSalePage")
);

// Sales - Advance
const AdvanceSalesPage = lazy(() =>
  import("@/pages/sales/advance-sale/main/AdvanceSalesPage")
);
const CreateAdvanceSalePage = lazy(() =>
  import("@/pages/sales/advance-sale/create/CreateAdvanceSalePage")
);
const AdvanceSaleDetailsPage = lazy(() =>
  import("@/pages/sales/advance-sale/details/AdvanceSaleDetailsPage")
);
const UpdateAdvanceSalePage = lazy(() =>
  import("@/pages/sales/advance-sale/update/UpdateAdvanceSalePage")
);

// Sales - Online
const OnlineSalesPage = lazy(() =>
  import("@/pages/sales/online-sale/main/OnlineSalesPage")
);
const CreateOnlineSalesPage = lazy(() =>
  import("@/pages/sales/online-sale/create/CreateOnlineSalePage")
);
const OnlineSaleDetailsPage = lazy(() =>
  import("@/pages/sales/online-sale/details/OnlineSaleDetailsPage")
);
const UpdateOnlineSalesPage = lazy(() =>
  import("@/pages/sales/online-sale/update/UpdateOnlineSalePage")
);

// Other pages
const DeliveryPage = lazy(() => import("@/pages/Delivery/DeliveryPage"));
const EmployeePage = lazy(() => import("@/pages/Employee/EmployeePage"));
const SuppliersPage = lazy(() => import("@/pages/supplier/main/SuppliersPage"));
const PurchaseFeesPage = lazy(() => import("@/pages/purchaseFee/PurchaseFeesPage"));
const ExpenseCategoriesPage = lazy(() =>
  import("@/pages/expense-category/main/ExpenseCategoriesPage")
);
const ExpensesPage = lazy(() => import("@/pages/expense/main/ExpensesPage"));
const ClientsPage = lazy(() => import("@/pages/client/main/ClientsPage"));

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingBar />;
  }

  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" />;
  }

  return  (
    <Layout>
      <Suspense fallback={<LoadingBar />}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/role_add" element={<CreateRolePage />} />
          <Route path="/role_update/:id" element={<UpdateRolePage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/purchase-fee" element={<PurchaseFeesPage />} />
          <Route path="/common" element={<CommonCompnentsPage />} />

          {/* Products & Categories */}
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/attributes" element={<AttributesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />

          {/* Purchases */}
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/create-purchases" element={<CreatePurchasePage />} />
          <Route path="/purchases/:id" element={<PurchaseDetailsPage />} />
          <Route path="/purchases/:id/edit" element={<UpdatePurchasePage />} />

          {/* Store Sales */}
          <Route path="/store-sales" element={<StoreSalesPage />} />
          <Route path="/store-sales/create" element={<CreateStoreSalePage />} />
          <Route path="/store-sales/:id" element={<StoreSaleDetailsPage />} />
          <Route
            path="/store-sales/:id/edit"
            element={<UpdateStoreSalePage />}
          />

          {/* Advance Sales */}
          <Route path="/advance-sales" element={<AdvanceSalesPage />} />
          <Route
            path="/advance-sales/create"
            element={<CreateAdvanceSalePage />}
          />
          <Route
            path="/advance-sales/:id"
            element={<AdvanceSaleDetailsPage />}
          />
          <Route
            path="/advance-sales/:id/edit"
            element={<UpdateAdvanceSalePage />}
          />

          {/* Online Sales */}
          <Route path="/online-sales" element={<OnlineSalesPage />} />
          <Route
            path="/online-sales/create"
            element={<CreateOnlineSalesPage />}
          />
          <Route path="/online-sales/:id" element={<OnlineSaleDetailsPage />} />
          <Route
            path="/online-sales/:id/edit"
            element={<UpdateOnlineSalesPage />}
          />

          {/* Expenses */}
          <Route
            path="/expenses-categories"
            element={<ExpenseCategoriesPage />}
          />
          <Route path="/expenses" element={<ExpensesPage />} />

          {/* Clients */}
          <Route path="/clients" element={<ClientsPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  // ) : (
  //   <Navigate to="/login" />
  // );
  )
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingBar />;

  return (
    <Suspense fallback={<LoadingBar />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />
          }
        />

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
