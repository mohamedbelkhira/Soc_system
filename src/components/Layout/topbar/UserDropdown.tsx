import * as React from "react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-provider";
import { getCurrentUserInfo } from "@/utils/getCurrentUserInfo";
import { LogOut, User } from "lucide-react";

const UserDropdown = React.memo(() => {
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.userId) {
        const fetchedUserInfo = await getCurrentUserInfo(user.userId);
        setUserInfo(fetchedUserInfo);
      }
    };
    fetchUserInfo();
  }, [user]);

  const userInitial = userInfo?.username
    ? userInfo.username.charAt(0).toUpperCase()
    : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-sidebar-primary-foreground dark:bg-sidebar-accent dark:text-sidebar-accent-foreground">
              {userInitial || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default UserDropdown;
