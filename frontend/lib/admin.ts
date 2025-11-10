// Admin utility functions and permissions management

import type { User, Permission } from "./types"

// Admin wallet addresses (set via environment variables in production)
const ADMIN_ADDRESSES = process.env.NEXT_PUBLIC_ADMIN_ADDRESSES?.split(",") || []
const SUPER_ADMIN_ADDRESS = process.env.NEXT_PUBLIC_SUPER_ADMIN_ADDRESS || ""

export function isAdmin(address: string): boolean {
  return ADMIN_ADDRESSES.includes(address) || address === SUPER_ADMIN_ADDRESS
}

export function isSuperAdmin(address: string): boolean {
  return address === SUPER_ADMIN_ADDRESS
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  if (user.role === "superadmin") return true
  return user.permissions.includes(permission)
}

export function getAdminRole(address: string): "user" | "admin" | "superadmin" {
  if (address === SUPER_ADMIN_ADDRESS) return "superadmin"
  if (ADMIN_ADDRESSES.includes(address)) return "admin"
  return "user"
}

export const ADMIN_PERMISSIONS: Record<string, Permission[]> = {
  admin: ["verify_users", "ban_users", "delete_posts", "review_reports", "access_admin_panel"],
  superadmin: [
    "verify_users",
    "ban_users",
    "delete_posts",
    "review_reports",
    "manage_traders",
    "access_admin_panel",
    "manage_admins",
  ],
}
