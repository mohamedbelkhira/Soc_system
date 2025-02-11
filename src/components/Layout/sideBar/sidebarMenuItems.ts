import {
  Box,
  Clock,
  Container,
  CreditCard,
  Euro,
  HandCoins,
  Home,
  KeySquare,
  PlaneLanding,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SwatchBook,
  Tag,
  Truck,
  Users,
  Wallet,
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
  {
    group: "Principale",
    icon: Home,
    items: [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    group: "Ventes",
    icon: Euro,
    items: [
      {
        title: "Magasin",
        url: "/store-sales",
        icon: ShoppingBag,
      },
      {
        title: "En ligne",
        url: "/online-sales",
        icon: ShoppingCart,
      },
      {
        title: "Avance",
        url: "/advance-sales",
        icon: Clock,
      },
    ],
  },
  {
    group: "Gestion des achats",
    icon: PlaneLanding,
    items: [
      {
        title: "Achats",
        url: "/purchases",
        icon: PlaneLanding,
      },
      {
        title: "Frais des achats",
        url: "/purchase-fee",
        icon: HandCoins,
      },
    ],
  },
  {
    group: "Gestion des Produits",
    icon: Box,
    items: [
      {
        title: "Produits",
        url: "/products",
        icon: Box,
      },
      {
        title: "Catégories de produits",
        url: "/categories",
        icon: Tag,
      },
      {
        title: "Attributs des variantes",
        url: "/attributes",
        icon: SwatchBook,
      },
    ],
  },
  {
    group: "Gestion du magasin",
    icon: Settings,
    items: [
      {
        title: "Roles",
        url: "/roles",
        icon: KeySquare,
      },
      {
        title: "Employés",
        url: "/employees",
        icon: Users,
      },
      {
        title: "Dépenses",
        url: "/expenses",
        icon: CreditCard,
      },
      {
        title: "Catégories des depenses",
        url: "/expenses-categories",
        icon: Wallet,
      },
    ],
  },
  {
    group: "Gestion des Relations",
    icon: Users,
    items: [
      {
        title: "Clients",
        url: "/clients",
        icon: Users,
      },
      {
        title: "Fournisseurs",
        url: "/suppliers",
        icon: Container,
      },
      {
        title: "Livraison",
        url: "/delivery",
        icon: Truck,
      },
    ],
  },
];
