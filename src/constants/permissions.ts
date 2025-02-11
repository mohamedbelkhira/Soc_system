// src/constants/permissions.ts

export enum PermissionAction {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
}

export interface PermissionItem {
  name: string;
  code: string;
}

export interface PermissionGroup {
  groupName: string;
  groupCode: string;
  permissions: PermissionItem[];
}

export const permissionActions: { action: PermissionAction; label: string }[] = [
  { action: PermissionAction.VIEW, label: 'Voir' },
  { action: PermissionAction.CREATE, label: 'Créer' },
  { action: PermissionAction.EDIT, label: 'Modifier' },
  { action: PermissionAction.DELETE, label: 'Supprimer' },
];

export const permissionGroups: PermissionGroup[] = [
  {
    groupName: 'Produits',
    groupCode: 'product',
    permissions: [],
  },
  {
    groupName: 'Achats',
    groupCode: 'purchase',
    permissions: [],
  },
  {
    groupName: 'Ventes',
    groupCode: 'sale',
    permissions: [],
  },
  {
    groupName: 'Dépenses',
    groupCode: 'expense',
    permissions: [],
  },
  {
    groupName: 'Paramètres',
    groupCode: 'settings',
    permissions: [],
  },
];

// Generate permissions for each group
permissionGroups.forEach((group) => {
  group.permissions = permissionActions.map(({ action, label }) => ({
    name: label,
    code: `${group.groupCode}_${action}`,
  }));
});
