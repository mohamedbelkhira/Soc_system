import { Permission } from "@/types/permission.enum";

export default function isAuthorized(
  requiredPermission: Permission,
  grantedPermissions: Permission[] | undefined
) {
  return grantedPermissions && grantedPermissions.includes(requiredPermission);
}
