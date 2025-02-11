import React from "react";

import StatusTag from "@/components/common/StatusTag";
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
import { Employee } from "@/types/employee.dto";
import { Job } from "@/types/job.dto";

import DeleteEmployeeDialog from "./delete/DeleteEmployeeDialog";
import UpdateEmployeeDialog from "./update/UpdateEmployeeDialog";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onChange: () => void;
  jobs: Job[]; // Add this
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onChange,
}) => {
  const {user}=useAuth();
  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;
  console.log("employe", employees);
  return (
    <TableWrapper>
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Compte</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8">
                Aucun employé trouvé.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.phoneNumber || "-"}</TableCell>
                <TableCell>{employee.job.name}</TableCell>

                <TableCell className="text-center">
                  <StatusTag isActive={employee.isActive} />
                </TableCell>
                <TableCell>
                  {employee.user
                    ? `Oui | ${employee.user.isActive ? "actif" : "inactif"}`
                    : "Non"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <CheckPermission
                    requiredPermission={Permission.SETTINGS_EDIT}
                    grantedPermissions={user?.permissions}
                    > 
                    <UpdateEmployeeDialog
                      employee={employee}
                      onUpdate={onChange}
                    />
                    </CheckPermission>

                    <CheckPermission
                    requiredPermission={Permission.SETTINGS_DELETE}
                    grantedPermissions={user?.permissions}
                    > 
                    <DeleteEmployeeDialog
                      employee={employee}
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

export default EmployeeTable;
