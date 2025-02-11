import React from "react";

import CheckPermission from "@/components/common/CheckPermission";
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
import { useAuth } from "@/contexts/auth-provider";
import { Job } from "@/types/job.dto";
import { Permission } from "@/types/permission.enum";
import { formatDate } from "@/utils/formatters/formatDate";

import DeleteJobDialog from "./delete/DeleteJobDialog";
import UpdateJobDialog from "./update/UpdateJobDialog";

interface JobsTableProps {
  jobs: Job[];
  isLoading: boolean;
  onChange: () => void;
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, isLoading, onChange }) => {
  const { user } = useAuth();

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] min-w-[150px]">Poste</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[200px]">
              Description
            </TableHead>
            <TableHead className="hidden md:table-cell w-[100px] min-w-[100px] text-center">
              Nbr Employé
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[120px] min-w-[120px] text-center">
              Créé à
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[120px] min-w-[120px] text-center">
              Mis à jour à
            </TableHead>
            <TableHead className="text-center w-[80px] min-w-[80px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8">
                Aucun poste trouvé.
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell className="truncate hidden sm:table-cell">
                  {job.description || "-"}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {job.employees.length}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {formatDate(job.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.SETTINGS_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateJobDialog job={job} onUpdate={onChange} />
                    </CheckPermission>

                    <CheckPermission
                      requiredPermission={Permission.SETTINGS_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteJobDialog job={job} onDelete={onChange} />
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

export default JobsTable;
