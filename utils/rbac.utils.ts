import { ACTION_VALUE } from "@/constants/rbac.constants";
import { Resource, Action, ResourcePermission } from "@/types/auth.types";

/**
 * Check if user has a specific permission for a resource
 * @param userPermissions - User's permissions object (e.g., {product: ["view", "edit"], user: ["view", "assign"]})
 * @param resource - The resource to check (dashboard, product, user, role)
 * @param permission - The permission to check (access, view, create, edit, delete, assign)
 * @returns boolean indicating if user has the permission
 */
export function hasPermission(userPermissions: ResourcePermission, resource: Resource, permission: Action): boolean {
  const resourcePermission = userPermissions[resource];
  if (!resourcePermission) return false;
  return resourcePermission.includes(permission);
}

/**
 * Check if user has view permission for a resource
 */
export function canAccess(userPermissions: ResourcePermission, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, ACTION_VALUE.VIEW);
}

/**
 * Check if user has edit permission for a resource
 */
export function canEdit(userPermissions: ResourcePermission, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, ACTION_VALUE.EDIT);
}

/**
 * Check if user has delete permission for a resource
 */
export function canDelete(userPermissions: ResourcePermission, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, ACTION_VALUE.DELETE);
}

/**
 * Check if user has assign permission for a resource
 */
export function canAssign(userPermissions: ResourcePermission, resource: Resource): boolean {
  return hasPermission(userPermissions, resource, ACTION_VALUE.ASSIGN);
}

// export function hasAllPermissions(
//   userPermissions: ResourcePermission,
//   resource: Resource,
//   permissions: PermissionKey[],
// ): boolean {
//   return permissions.every((permission) => hasPermission(userPermissions, resource, permission));
// }

// export function hasAnyPermission(
//   userPermissions: ResourcePermission,
//   resource: Resource,
//   permissions: PermissionKey[],
// ): boolean {
//   return permissions.some((permission) => hasPermission(userPermissions, resource, permission));
// }

/**
 * Get all permissions a user has for a specific resource
 * @param userPermissions - User's permissions object
 * @param resource - The resource to check
 * @returns Array of actions the user has for the resource, or undefined if none
 */
export function getResourcePermissions(userPermissions: ResourcePermission, resource: Resource): Action[] | undefined {
  return userPermissions[resource];
}

/**
 * Add a permission to a resource's permission list (no-op if already present)
 * @param userPermission - User's permissions object
 * @param resource - The resource to update
 * @param action - The action to add
 * @returns New permissions object with the action added
 */
export function addPermission(resourcePermission: Action[], action: Action): Action[] {
  const alreadyHasPermission = resourcePermission.includes(action);
  if (alreadyHasPermission) return resourcePermission;

  resourcePermission.push(action);
  return resourcePermission;
}

/**
 * Remove a permission from a resource's permission list (no-op if not present)
 * @param userPermission - User's permissions object
 * @param resource - The resource to update
 * @param action - The action to remove
 * @returns New permissions object with the action removed
 */
export function removePermission(resourcePermission: Action[], action: Action): Action[] {
  const alreadyHasPermission = resourcePermission.includes(action);
  if (!alreadyHasPermission) return resourcePermission;
  return resourcePermission.filter((p) => p !== action);
}

// export function togglePermission(currentPermission: number, permission: PermissionKey): number {
//   return currentPermission ^ PERMISSION_VALUE[permission];
// }

// export function createPermissionValue(permissions: PermissionKey[]): number {
//   return permissions.reduce((acc, permission) => acc | PERMISSION_VALUE[permission], 0);
// }

// export function includesPermission(permissionValue: number, permission: PermissionKey): boolean {
//   const permValue = PERMISSION_VALUE[permission];
//   return (permissionValue & permValue) === permValue;
// }
