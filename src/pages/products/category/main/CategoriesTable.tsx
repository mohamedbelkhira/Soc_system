import CheckPermission from "@/components/common/CheckPermission";
import StatusTag from "@/components/common/StatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-provider";
import { Category } from "@/types/category.dto";
import { Permission } from "@/types/permission.enum";
import { formatDate } from "@/utils/formatters/formatDate";

import DeleteCategoryDialog from "../delete/DeleteCategoryDialog";
import UpdateCategoryDialog from "../update/UpdateCategoryDialog";

export default function CategoriesTable({
  isLoading,
  categories,
}: {
  isLoading: boolean;
  categories: Category[];
}) {
  const { user } = useAuth();
  if (isLoading) return <TableSkeleton />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nom</TableHead>
            <TableHead>Attributs</TableHead>
            <TableHead className="w-[180px]">Créé à</TableHead>
            <TableHead className="w-[180px]">Mis à jour à</TableHead>
            <TableHead className="w-[180px] text-center">Statut</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="whitespace-nowrap space-x-2">
                  {category.categoryAttributes.length ? (
                    category.categoryAttributes.map((categoryAttribute) => (
                      <Badge
                        key={categoryAttribute.id}
                        variant={
                          categoryAttribute.isPrimary ? "secondary" : "outline"
                        }
                      >
                        {categoryAttribute.attribute.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      Pas d'attributs
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell>{formatDate(category.updatedAt)}</TableCell>
                <TableCell className="text-center">
                  <StatusTag isActive={category.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.PRODUCT_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateCategoryDialog category={category} />
                    </CheckPermission>

                    <CheckPermission
                      requiredPermission={Permission.PRODUCT_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteCategoryDialog category={category} />
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
