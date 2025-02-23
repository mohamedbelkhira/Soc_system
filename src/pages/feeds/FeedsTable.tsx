import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeedResponse } from "@/dto/feed.dto";
import { formatDate } from "@/utils/formatters/formatDate";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
import DeleteFeedDialog from "./delete/DeleteFeedDialog";
import UpdateFeedDialog from "./update/UpdateFeedPage";
import TableWrapper from "@/components/common/TableWrapper";

interface FeedsTableProps {
  isLoading: boolean;
  feeds: FeedResponse[];
  onChange: () => void;
}

const FeedsTable: React.FC<FeedsTableProps> = ({ isLoading, feeds, onChange }) => {
  const { user } = useAuth();

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Titre</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="hidden lg:table-cell w-[150px] text-center">
              Actif
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[150px] text-center">
              Dernière vérification
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[150px] text-center">
              Créé à
            </TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun flux trouvé.
              </TableCell>
            </TableRow>
          ) : (
            feeds.map((feed) => (
              <TableRow key={feed.feedId}>
                <TableCell className="font-medium">
                  {feed.title || "Flux sans titre"}
                </TableCell>
                <TableCell>{feed.url}</TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {feed.active ? "Oui" : "Non"}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {feed.lastChecked ? formatDate(feed.lastChecked) : '-'}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {formatDate(feed.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.FEEDS_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateFeedDialog feed={feed} onUpdate={onChange} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.FEEDS_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteFeedDialog feed={feed} onDelete={onChange} />
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

export default FeedsTable;
