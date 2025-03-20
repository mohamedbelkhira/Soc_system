
import {
 
  Euro,

  Home,
  KeySquare,
  Settings,
  Users,
  Rss,
  Newspaper,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  collapsible?: boolean;
  children?: MenuItem[];
}

export interface MenuGroup {
  group: string;
  icon: React.ComponentType;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  // {
  //   group: "Principale",
  //   icon: Home,
  //   items: [
  //     {
  //       title: "Tableau de bord",
  //       url: "/dashboard",
  //       icon: Home,
  //     },
  //   ],
  // },
  {
    group: "Feeds",
    icon: Euro,
    items: [
      {
        title: "RSS-Feeds",
        url: "/feeds-items?page=1&limit=10",
        icon: Newspaper,
      },
      {
        title: "RSS-Sources",
        url: "/feeds",
        icon: Rss,
      }
    
    ],
  },

  {
    group: "Management",
    icon: Settings,
    items: [
      {
        title: "Roles",
        url: "/roles",
        icon: KeySquare,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
    ],
  }
  
];
