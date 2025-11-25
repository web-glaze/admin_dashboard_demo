import { NavItem, NavItemWithOptionalChildren } from "@/types/navItem";
import { USER_ROLE } from "./enums";
export const CLIENT_TOKEN_STORAGE_KEY = "access_token";

export const navItems: NavItemWithOptionalChildren[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    role: [USER_ROLE.ADMIN],
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Team",
    href: "/dashboard/team",
    role: [USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.PARTNER],
    icon: "users",
    label: "Team",
    items: [
      {
        title: "Partners",
        href: "/dashboard/team/partner",
        role: [USER_ROLE.ADMIN],
        items: [],
      },
      {
        title: "Managers",
        href: "/dashboard/team/manager",
        role: [USER_ROLE.ADMIN, USER_ROLE.PARTNER],
        items: [],
      },

      {
        title: "Employees",
        href: "/dashboard/team/employee",
        role: [USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.PARTNER],
        items: [],
      },
    ],
  },
  {
    title: "Entity",
    href: "/dashboard/entity",
    role: [USER_ROLE.ADMIN],
    icon: "mail",
    label: "messages",
  },
  {
    title: "Groups",
    href: "/dashboard/groups",
    icon: "users",
    role: [USER_ROLE.ADMIN],
    label: "user",
  },
  {
    title: "All KRA's",
    href: "/dashboard/kra",
    role: [USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.PARTNER],
    icon: "help",
    label: "All KRA's",
  },
  {
    title: "All Assigned KRA's",
    href: "/dashboard/assignedKra",
    role: [
      USER_ROLE.ADMIN,
      USER_ROLE.USER,
      USER_ROLE.MANAGER,
      USER_ROLE.PARTNER,
    ],
    icon: "help",
    label: "All Assigned KRA's",
  },

  {
    title: "Profile",
    href: "/dashboard/profile",
    role: [
      USER_ROLE.ADMIN,
      USER_ROLE.USER,
      USER_ROLE.MANAGER,
      USER_ROLE.PARTNER,
    ],
    icon: "profile",
    label: "profile",
  },
  {
    title: "Logout",
    role: [
      USER_ROLE.ADMIN,
      USER_ROLE.USER,
      USER_ROLE.MANAGER,
      USER_ROLE.PARTNER,
    ],
    href: "/",
    icon: "login",
    label: "Logout",
  },
];
