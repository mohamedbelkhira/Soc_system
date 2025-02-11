import TableWrapper from "@/components/common/TableWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/types/clients/client.dto";
import { formatDate } from "@/utils/formatters/formatDate";

import DeleteClientDialog from "../delete/DeleteClientDialog";
import { UpdateClientDialog } from "../update/UpdateClientDialog";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
export default function ClientsTable({
  isLoading,
  clients,
}: {
  isLoading: boolean;
  clients: Client[];
}) {
  const {user}= useAuth();
  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom et Prénom</TableHead>
            <TableHead>Numéro de téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Ajouté à</TableHead>
            <TableHead>Mis à jour à</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                Aucun attribut trouvé.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.firstName} {client.lastName}
                </TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{client.email ?? "-"}</TableCell>
                <TableCell>{client.address || "-"}</TableCell>
                <TableCell>{formatDate(client.createdAt)}</TableCell>
                <TableCell>{formatDate(client.updatedAt)}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <CheckPermission
                    requiredPermission={Permission.SALE_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                    <UpdateClientDialog client={client} />
                    </CheckPermission>
                    <CheckPermission
                    requiredPermission={Permission.SALE_DELETE}
                    grantedPermissions={user?.permissions}
                    >
                      <DeleteClientDialog client={client} />
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
