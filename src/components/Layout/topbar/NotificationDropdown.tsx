// src/components/NotificationDropdown.tsx
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { env } from "@/config/environment";
import { useLowStockProducts } from "@/swr/products/product.swr";
import getProductQuantity from "@/utils/getProductQuantity";
import { Bell, Box, Package } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "New comment on your post",
    timestamp: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "You have a new follower",
    timestamp: "10 mins ago",
    read: false,
  },
  { id: 3, title: "Update available", timestamp: "1 hour ago", read: true },
];

const NotificationDropdown: React.FC = React.memo(() => {
  const { data: products } = useLowStockProducts();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {products.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs"
            >
              {products.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Rupture de stock (moins de 5 unités)
            </DropdownMenuLabel>
            {products.length > 0 ? (
              products.map((product) => (
                <DropdownMenuItem
                  key={product.id}
                  className="flex items-center py-3 px-4 hover:bg-accent cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 relative rounded-md border">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                          src={`${env.BACKEND_URL}/${product.imageUrls[0]}`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
                          <Box className="text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        En Stock: {getProductQuantity(product)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No low stock products
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default NotificationDropdown;
