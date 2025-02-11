import React from "react";

import ExpenseStatusTag from "@/components/common/ExpenseStatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import DeleteAction from "@/components/common/actions/DeleteAction";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expense } from "@/types/expense.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";

import DeleteExpenseDialog from "../delete/DeleteExpenseDialog";
import UpdateExpenseDialog from "../update/UpdateExpenseDialog";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";


interface ExpensesTableProps {
  isLoading: boolean;
  expenses: Expense[];
  onRefresh: () => void; // Add onRefresh prop
}

export default function ExpensesTable({
  isLoading,
  expenses,
  onRefresh,
}: ExpensesTableProps) {
  const {user}=useAuth();
  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Catégorie</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px] text-center">Statut</TableHead>
            <TableHead className="w-[150px]">Montant</TableHead>
            <TableHead className="w-[150px]">Échéance</TableHead>
            <TableHead className="w-[150px]">Payé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                Aucune dépense trouvée.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {expense.category.name}
                </TableCell>
                <TableCell>
                  {expense.description
                    ? expense.description
                    : "Pas de description fournis"}
                </TableCell>
                <TableCell className="text-center">
                  {" "}
                  <ExpenseStatusTag status={expense.status} />{" "}
                </TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell>
                  {expense.dueAt ? formatDate(expense.dueAt) : "Non Mentionné"}
                </TableCell>
                <TableCell>
                  {expense.paidAt
                    ? formatDate(expense.paidAt)
                    : "Non Mentionné"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Update Expense */}
                  <CheckPermission
                    requiredPermission={Permission.EXPENSE_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                    <UpdateExpenseDialog
                      expense={expense}
                      onUpdate={onRefresh} // Pass onRefresh callback
                    />
                      </CheckPermission> 
                    {/* Delete Expense */}
                    <CheckPermission
                      requiredPermission={Permission.EXPENSE_DELETE}
                      grantedPermissions={user?.permissions}
                      >
                      <DeleteExpenseDialog
                        expense={expense}
                        trigger={<DeleteAction />} // Pass onRefresh callback
                      />
                    </CheckPermission> 
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
