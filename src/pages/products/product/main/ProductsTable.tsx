import CheckPermission from "@/components/common/CheckPermission";
import QuantityTag from "@/components/common/QuantityTag";
import StatusTag from "@/components/common/StatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import DeleteAction from "@/components/common/actions/DeleteAction";
import UpdateAction from "@/components/common/actions/UpdateAction";
import ViewAction from "@/components/common/actions/ViewAction";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { env } from "@/config/environment";
import { useAuth } from "@/contexts/auth-provider";
import { Permission } from "@/types/permission.enum";
import { Product } from "@/types/product.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import getProductQuantity from "@/utils/getProductQuantity";
import { Box } from "lucide-react";

import DeleteProductDialog from "../delete/product/DeleteProductDialog";

export default function ProductsTable({
  isLoading,
  products,
}: {
  isLoading: boolean;
  products: Product[];
}) {
  const { user } = useAuth();
  if (isLoading) return <TableSkeleton />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            {env.ENABLE_PRODUCT_IMAGES && (
              <TableHead className="w-[120px]"></TableHead>
            )}
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Marque</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead className="text-center">Quantité</TableHead>
            <TableHead className="text-center w-[180px]">Statut</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center">
                Aucun produit trouvé.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                {env.ENABLE_PRODUCT_IMAGES && (
                  <TableCell>
                    <div className="w-16 h-16 relative rounded-md border">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                          src={`${env.BACKEND_URL}/${product.imageUrls[0]}`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
                          <Box className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-wrap font-medium">
                  {product.name}
                </TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.brand}</TableCell>

                <TableCell>{formatCurrency(product.retailPrice)}</TableCell>
                <TableCell>
                  {product.hasVariants ? (
                    <span className="text-sm text-muted-foreground">
                      {product.variants?.length || 0} variants
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Sans variant
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <QuantityTag quantity={getProductQuantity(product)} />
                </TableCell>
                <TableCell className="text-center w-[180px]">
                  <StatusTag isActive={product.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.PRODUCT_VIEW}
                      grantedPermissions={user?.permissions}
                    >
                      <ViewAction href={`/products/${product.id}`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.PRODUCT_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateAction href={`/products/${product.id}/edit`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.PRODUCT_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteProductDialog
                        product={product}
                        trigger={<DeleteAction />}
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
