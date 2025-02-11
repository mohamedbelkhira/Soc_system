import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseCategoriesTable from "./ExpenseCategoriesTable";
import { useExpenseCategories } from "@/swr/expenseCategory.swr";
import { showToast } from "@/utils/showToast";
import CreateExpenseCategoryDialog from "../create/CreateExpenseCategoryDialog";
// import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";


export default function ExpenseCategoriesPage() {
  const { data, error, isLoading } = useExpenseCategories();
 const {user}=useAuth();
  useEffect(() => {
    if (error) {
      showToast("error", "Erreur de chargement des catégories de dépenses");
    }
  }, [error]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Liste des catégories de dépenses ({data ? data.length : 0})
        </CardTitle>
        <CheckPermission
            requiredPermission={Permission.EXPENSE_CREATE}
            grantedPermissions={user?.permissions}
          >
          <CreateExpenseCategoryDialog />
          </CheckPermission> 
        {/* AddButton is omitted as per your request */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ExpenseCategoriesTable
            isLoading={isLoading}
            expenseCategories={data || []}
          />
          {/* Pagination is omitted as per your request */}
        </div>
      </CardContent>
    </Card>
  );
}
