import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingBar from "@/components/Layout/LoadingBar.js";
import { useAuth } from "@/contexts/auth-provider";

import FeedsPage from "@/pages/feeds/FeedsPage";
import FeedItemsPage from "@/pages/FeedItems/FeedItemsPage";
import UsersPage from "@/pages/user/UsersPage";
const Layout = lazy(() => import("@/layouts/layout.js"));
// Lazy load pages
const LoginPage = lazy(() => import("@/pages/LoginPage.js"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage.js"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.js"));
const CommonCompnentsPage = lazy(() => import("@/pages/CommonComponentsPage"));

const RolesPage = lazy(() => import("@/pages/roles/RolesPage"));
const CreateRolePage = lazy(() => import("@/pages/roles/create/CreateRolePage"));
const UpdateRolePage = lazy(() => import("@/pages/roles/update/UpdateRolePage"));


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
          <Route path="/feeds" element={<FeedsPage />} />
          <Route path="/feeds-items" element={<FeedItemsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/role_add" element={<CreateRolePage />} />
          <Route path="/role_update/:id" element={<UpdateRolePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/common" element={<CommonCompnentsPage />} />

       

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
            !isAuthenticated ? <LoginPage /> : <Navigate to="/common" />
          }
        />

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
