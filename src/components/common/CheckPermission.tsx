import { ReactNode } from "react";

import { Permission } from "@/types/permission.enum";
import isAuthorized from "@/utils/isAuthorized";

export default function CheckPermission({
  requiredPermission,
  grantedPermissions,
  children,
}: {
  requiredPermission: Permission;
  grantedPermissions: Permission[] | undefined;
  children: ReactNode;
}) {
  if (isAuthorized(requiredPermission, grantedPermissions)) return children;
  return null;
}
