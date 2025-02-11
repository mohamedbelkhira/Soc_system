import * as React from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

import UserDropdown from "./UserDropdown";

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-sidebar dark:bg-gray-700 w-full transition-colors duration-300 py-4 px-6 border-b">
      <SidebarTrigger onClick={onToggleSidebar} />

      <div className="flex items-center space-x-4">
        <ModeToggle />
        <UserDropdown />
      </div>
    </header>
  );
};

export default TopBar;
