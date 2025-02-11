import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseCategory } from "@/types/expenseCategory.dto";
import TableWrapper from "@/components/common/TableWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatters/formatDate";
import DeleteExpenseCategoryDialog from "../delete/DeleteExpenseCategoriesDialog";
import UpdateExpenseCategoryDialog from "../update/UpdateExpenseCategoryDialog";

import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";

export default function ExpenseCategoriesTable({
  isLoading,
  expenseCategories,
}: {
  isLoading: boolean;
  expenseCategories: ExpenseCategory[];
}) {
  const {user} = useAuth();
  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[180px]">Créé à</TableHead>
            <TableHead className="w-[180px]">Mis à jour à</TableHead>
            <TableHead  className="text-right" >Actions</TableHead>
            {/* Actions column is omitted for now */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenseCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                Aucune catégorie de dépenses trouvée.
              </TableCell>
            </TableRow>
          ) : (
            expenseCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>
                  {formatDate(category.createdAt)}
                </TableCell>
                <TableCell>
                {formatDate(category.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <CheckPermission
                    requiredPermission={Permission.EXPENSE_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                    <UpdateExpenseCategoryDialog 
                        expenseCategory={category}
                      />
                  </CheckPermission> 
                    {/* Delete ExpenseCategory */}
                  
                    <CheckPermission
                      requiredPermission={Permission.EXPENSE_DELETE}
                      grantedPermissions={user?.permissions}
                      >
                      <DeleteExpenseCategoryDialog 
                        expenseCategory={category}
                      />
                     </CheckPermission> 
                  </div>
                </TableCell>
                {/* Actions cell is omitted */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}