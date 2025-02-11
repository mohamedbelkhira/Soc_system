// EmployeePage.tsx
import React, { useEffect, useState } from "react";

import { employeesApi } from "@/api/employees.api";
import { jobsApi } from "@/api/jobs.api";
import CheckPermission from "@/components/common/CheckPermission";
import Page from "@/components/common/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { Employee } from "@/types/employee.dto";
import { Job } from "@/types/job.dto";
import { Permission } from "@/types/permission.enum";
import { showToast } from "@/utils/showToast";

import EmployeeTable from "./EmployeeTable";
import JobsTable from "./JobsTable";
import CreateEmployeeDialog from "./create/CreateEmployeeDialog";
import { CreateJobDialog } from "./create/CreateJobDialog";

export const EmployeePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const { user } = useAuth();

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const data = await jobsApi.getAll();
      setJobs(data.data);
    } catch (error) {
      showToast("error", "Erreur de connexion");
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const data = await employeesApi.getAll();
      setEmployees(data.data);
    } catch (error) {
      showToast("error", "Erreur de connexion");
      console.error("Failed to fetch employees:", error);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Combined fetch function
  const refreshData = () => {
    fetchJobs();
    fetchEmployees();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Page title="Gestion des Employés et Postes">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des Employés</CardTitle>
          <CheckPermission
            requiredPermission={Permission.SETTINGS_CREATE}
            grantedPermissions={user?.permissions}
          >
            <CreateEmployeeDialog onAdd={refreshData} jobs={jobs} />
          </CheckPermission>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            onChange={refreshData}
            isLoading={isLoadingEmployees}
            employees={employees}
            jobs={jobs}
          />
        </CardContent>
      </Card>

      {/* Job Section */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des Postes</CardTitle>
          <CheckPermission
            requiredPermission={Permission.SETTINGS_CREATE}
            grantedPermissions={user?.permissions}
          >
            <CreateJobDialog onAdd={refreshData} />
          </CheckPermission>
        </CardHeader>
        <CardContent>
          <JobsTable
            onChange={refreshData}
            isLoading={isLoadingJobs}
            jobs={jobs}
          />
        </CardContent>
      </Card>
    </Page>
  );
};

export default EmployeePage;
