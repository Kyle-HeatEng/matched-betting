import {
  BarChart3,
  LayoutDashboard,
  type LucideIcon,
  LogIn,
  ShieldCheck,
  Target,
  WalletCards,
} from "lucide-react";

type AppNavPath =
  | "/offers"
  | "/events"
  | "/dashboard"
  | "/settings/smarkets"
  | "/admin"
  | "/login";

type NavItem = {
  to: AppNavPath;
  label: string;
  icon: LucideIcon;
};

export const navItems: ReadonlyArray<NavItem> = [
  { to: "/offers", label: "Offers", icon: Target },
  { to: "/events", label: "Events", icon: BarChart3 },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/settings/smarkets", label: "Smarkets", icon: WalletCards },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export const authItems: ReadonlyArray<NavItem> = [
  { to: "/login", label: "Login", icon: LogIn },
];
