import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suppliersApi } from "@/api/suppliers.api";

import { showToast } from "@/utils/showToast";
import { Supplier } from "@/types/supplier.dto";
import SuppliersTable from "./SuppliersTable";
import CreateSupplierDialog from "../create/CreateSupplierDialog";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
import { useAuth } from "@/contexts/auth-provider";

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {user} = useAuth();
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await suppliersApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      showToast("error", "Erreur de connexion lors de la récupération des fournisseurs.");
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = () => {
    fetchSuppliers();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des Fournisseurs ({suppliers.length})</CardTitle>
        <CheckPermission
                    requiredPermission={Permission.PURCHASE_CREATE}
                    grantedPermissions={user?.permissions}
                    >
        <CreateSupplierDialog onCreate={handleChange} />
        </CheckPermission>
      </CardHeader>
      <CardContent>
        <SuppliersTable
          onChange={handleChange}
          isLoading={isLoading}
          suppliers={suppliers}
        />
      </CardContent>
    </Card>
  );
}

export default SuppliersPage;