import React from "react";

import AppSidebar from "@/components/Layout/sideBar/AppSidebar";
import TopBar from "@/components/Layout/topbar/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Toaster } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage<boolean>(
    "sidebar:state",
    true
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <SidebarProvider defaultOpen={isSidebarOpen}>
        <AppSidebar />
        <div className="flex-1 flex flex-col relative">
          <div className="sticky top-0 z-50">
            <TopBar onToggleSidebar={toggleSidebar} />
          </div>
          <div className="flex-1 p-4 md:p-6 bg-background dark:bg-gray-800">
            {children}
          </div>
        </div>
      </SidebarProvider>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
