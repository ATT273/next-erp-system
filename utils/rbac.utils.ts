import { PERMISSION_VALUE } from "@/constants/rbac.constants";
import { PermissionKey, Resource, Permissions } from "@/types/auth.types";

/**
 * Check if user has a specific permission for a resource
 * @param userPermissions - User's permissions object (e.g., {dashboard: 7, product: 7, user: 15, role: 7})
 * @param resource - The resource to check (dashboard, product, user, role)
 * @param permission - The permission to check (ACCESS, EDIT, DELETE, ASSIGN)
 * @returns boolean indicating if user has the permission
 */
export function hasPermission(userPermissions: Permissions, resource: Resource, permission: PermissionKey): boolean {
  const resourcePermission = userPermissions[resource] ?? 0;
  const permissionValue = PERMISSION_VALUE[permission];
  return (resourcePermission & permissionValue) === permissionValue;
}

/**
 * Check if user has access permission for a resource
 */
export function canAccess(userPermissions: Permissions, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, "ACCESS");
}

/**
 * Check if user has edit permission for a resource
 */
export function canEdit(userPermissions: Permissions, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, "EDIT");
}

/**
 * Check if user has delete permission for a resource
 */
export function canDelete(userPermissions: Permissions, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, "DELETE");
}

/**
 * Check if user has assign permission for a resource
 */
export function canAssign(userPermissions: Permissions, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, "ASSIGN");
}

/**
 * Check if user has multiple permissions for a resource
 * @param userPermissions - User's permissions object
 * @param resource - The resource to check
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if user has ALL the specified permissions
 */
export function hasAllPermissions(
  userPermissions: Permissions,
  resource: Resource,
  permissions: PermissionKey[],
): boolean {
  return permissions.every((permission) => hasPermission(userPermissions, resource, permission));
}

/**
 * Check if user has at least one of the specified permissions for a resource
 * @param userPermissions - User's permissions object
 * @param resource - The resource to check
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if user has ANY of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: Permissions,
  resource: Resource,
  permissions: PermissionKey[],
): boolean {
  return permissions.some((permission) => hasPermission(userPermissions, resource, permission));
}

/**
 * Get all permissions a user has for a specific resource
 * @param userPermissions - User's permissions object
 * @param resource - The resource to check
 * @returns Array of permission keys that the user has
 */
export function getResourcePermissions(userPermissions: Permissions, resource: Resource): PermissionKey[] {
  const permissions: PermissionKey[] = [];
  const permissionKeys = Object.keys(PERMISSION_VALUE) as PermissionKey[];

  for (const permission of permissionKeys) {
    if (hasPermission(userPermissions, resource, permission)) {
      permissions.push(permission);
    }
  }

  return permissions;
}

/**
 * Add a permission to a resource permission value
 * @param currentPermission - Current permission value for the resource
 * @param permission - Permission to add
 * @returns New permission value
 */
export function addPermission(currentPermission: number, permission: PermissionKey): number {
  return currentPermission | PERMISSION_VALUE[permission];
}

/**
 * Remove a permission from a resource permission value
 * @param currentPermission - Current permission value for the resource
 * @param permission - Permission to remove
 * @returns New permission value
 */
export function removePermission(currentPermission: number, permission: PermissionKey): number {
  return currentPermission & ~PERMISSION_VALUE[permission];
}

/**
 * Toggle a permission for a resource permission value
 * @param currentPermission - Current permission value for the resource
 * @param permission - Permission to toggle
 * @returns New permission value
 */
export function togglePermission(currentPermission: number, permission: PermissionKey): number {
  return currentPermission ^ PERMISSION_VALUE[permission];
}

/**
 * Create a permission value from an array of permissions
 * @param permissions - Array of permissions to combine
 * @returns Combined permission value
 */
export function createPermissionValue(permissions: PermissionKey[]): number {
  return permissions.reduce((acc, permission) => acc | PERMISSION_VALUE[permission], 0);
}

/**
 * Check if a permission value includes a specific permission
 * @param permissionValue - The permission value to check
 * @param permission - The permission to check for
 * @returns boolean indicating if the permission is included
 */
export function includesPermission(permissionValue: number, permission: PermissionKey): boolean {
  const permValue = PERMISSION_VALUE[permission];
  return (permissionValue & permValue) === permValue;
}
