import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {ShieldCheck } from "lucide-react";

import { MenuGroup, menuGroups } from "./sidebarMenuItems";

const AppSidebar: React.FC = () => {
  const location = useLocation();

  // Function to render menu items for each group
  const renderMenuItems = (items: MenuGroup["items"]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.url;
      return (
        <SidebarMenuItem
          key={item.title}
          className="flex items-center justify-center p-0 gap-0"
        >
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className="group-data-[collapsible=icon]:bg-transparent px-4 py-3"
          >
            <Link
              to={item.url!}
              className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-2  text-sidebar-foreground "
            >
              <item.icon />
              <span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:[&>svg]:size-6">
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:hidden">
      <div className="group-data-[collapsible=icon]:hidden">
      <div className="relative overflow-hidden px-3 py-1.5 rounded-md bg-emerald-600 flex items-center gap-6 text-xl text-white font-medium">
        <div
          style={{ backgroundColor: "rgba(52, 211, 153, 0.56)" }}
          className="absolute -top-6 -right-6 w-20 aspect-square rounded-full"
        />
        <div
          style={{ backgroundColor: "rgba(52, 211, 153, 0.63)" }}
          className="absolute -bottom-6 -right-6 w-16 aspect-square rounded-full"
        />
        <div className="bg-emerald-700 p-2 rounded-md">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col">
          <span className="leading-5 text-lg">DSD</span>
          <span className="text-sm text-white/85">supervision & detection</span>
        </div>
      </div>
    </div>
      </SidebarHeader>


      {/* <SidebarContent className="pt-5"> */}
      <SidebarContent >
        {menuGroups.map((group) => (
          <SidebarGroup key={group.group} className="pb-2">
            <SidebarGroupLabel className="font-medium">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(group.items)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
