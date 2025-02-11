// src/components/DeliveryHandlersTable.tsx
import React from "react";

import StatusTag from "@/components/common/StatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeliveryHandler } from "@/types/deliveryHandler.dto";
import DeleteDeliveryHandlerDialog from "./delete/DeleteDeliveryHandlerDialog";
import UpdateDeliveryHandlerDialog from "./update/UpdateDeliveryHandlerDialog";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
import { getDeliveryHandlerTypeLabel } from "@/utils/getDeliveryHandlerTypeLabel";
interface DeliveryHandlersTableProps {
  deliveryHandlers: DeliveryHandler[];
  onChange: () => void;
}

const DeliveryHandlersTable: React.FC<DeliveryHandlersTableProps> = ({
  deliveryHandlers,
  onChange,
}) => {
  const {user} = useAuth();
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead className="w-[180px]">Coût de Livraison</TableHead>
            <TableHead className="w-[180px]">Coût de Retour </TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryHandlers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Aucun Livreur trouvé.
              </TableCell>
            </TableRow>
          ) : (
            deliveryHandlers.map((handler) => (
              <TableRow key={handler.id}>
                <TableCell>
                  {handler.type === "EMPLOYEE"
                    ? `${handler.employee?.firstName || ""} ${handler.employee?.lastName || ""}`.trim() ||
                      "-"
                    : handler.agency?.name || "-"}
                </TableCell>
                <TableCell>{getDeliveryHandlerTypeLabel(handler.type)}</TableCell>
                <TableCell>
                  {handler.type === "EMPLOYEE"
                    ? handler.employee?.phoneNumber || "-"
                    : handler.agency?.phoneNumber || "-"}
                </TableCell>
                <TableCell>{handler.deliveryCost}</TableCell>
                <TableCell>{handler.returnCost}</TableCell>
                <TableCell className="text-center">
                  <StatusTag isActive={handler.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <CheckPermission
                    requiredPermission={Permission.SALE_EDIT}
                    grantedPermissions={user?.permissions}
                    >

                    <UpdateDeliveryHandlerDialog
                      deliveryHandler={handler}
                      onUpdate={onChange}
                    />
                   </CheckPermission> 

                   <CheckPermission
                    requiredPermission={Permission.SALE_DELETE}
                    grantedPermissions={user?.permissions}
                    >

                    <DeleteDeliveryHandlerDialog
                      deliveryHandler={handler}
                      onDelete={onChange}
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
};

export default DeliveryHandlersTable;
