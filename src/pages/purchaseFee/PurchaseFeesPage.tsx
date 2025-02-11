// src/pages/PurchaseFeesPage.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { purchaseFeesApi } from "@/api/purchaseFees.api";
import { showToast } from "@/utils/showToast";
import { PurchaseFee } from "@/types/purchaseFee.dto";
import PurchaseFeesTable from "./PurchaseFeesTable";
import CreatePurchaseFeeDialog from "./create/CreatePurchaseFeeDialog";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
import { useAuth } from "@/contexts/auth-provider";

export function PurchaseFeesPage() {
  const { user } = useAuth();
  const [purchaseFees, setPurchaseFees] = useState<PurchaseFee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPurchaseFees();
  }, []);

  const fetchPurchaseFees = async () => {
    setIsLoading(true);
    try {
      const response = await purchaseFeesApi.getAll();
      if (response.status === "success") {
        setPurchaseFees(response.data);
      } else {
        showToast("error", response.message || "Failed to fetch purchase fees.");
      }
    } catch (error) {
      showToast("error", "Connection error while fetching purchase fees.");
      console.error("Failed to fetch purchase fees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = () => {
    fetchPurchaseFees();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>List des catégories de frais  ({purchaseFees.length})</CardTitle>
        <CheckPermission
            requiredPermission={Permission.PURCHASE_CREATE}
            grantedPermissions={user?.permissions}
          > 
           <CreatePurchaseFeeDialog onCreate={handleChange} />
        </CheckPermission>
       
      </CardHeader>
      <CardContent>
        <PurchaseFeesTable
          onChange={handleChange}
          isLoading={isLoading}
          purchaseFees={purchaseFees}
        />
      </CardContent>
    </Card>
  );
}

export default PurchaseFeesPage;
