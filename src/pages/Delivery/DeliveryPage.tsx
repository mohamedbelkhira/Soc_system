
import React, { useEffect, useState } from 'react';
import { DeliveryHandler } from '@/types/deliveryHandler.dto';
import { deliveryHandlersApi } from '@/api/deliveryHandler.api';
import CreateDeliveryHandlerDialog from './create/CreateDeliveryHandlerDialog';
import DeliveryHandlersTable from './DeliveryHandlersTable';
import { showToast } from '@/utils/showToast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-provider';
import { Permission } from '@/types/permission.enum';
import CheckPermission from '@/components/common/CheckPermission';

const DeliveryPage: React.FC = () => {
  const [deliveryHandlers, setDeliveryHandlers] = useState<DeliveryHandler[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {user} = useAuth();
  // Fetch all delivery handlers
  const fetchDeliveryHandlers = async () => {
    setIsLoading(true);
    try {
      const response = await deliveryHandlersApi.getAll();
      if (response.status === 'success') {
        setDeliveryHandlers(response.data);
      } else {
        showToast('error', response.message || 'Failed to fetch delivery handlers');
      }
    } catch (err) {
      showToast('error', 'An error occurred while fetching delivery handlers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryHandlers();
  }, []);

  // Callback to refresh the table after adding a new delivery handler
  const handleAddDeliveryHandler = () => {
    fetchDeliveryHandlers();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Livreur</CardTitle>
        <CheckPermission
                    requiredPermission={Permission.SALE_CREATE}
                    grantedPermissions={user?.permissions}
                    >
          <CreateDeliveryHandlerDialog onAdd={handleAddDeliveryHandler} />
        </CheckPermission>

      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full rounded-md min-h-24" />
        ) : (
          <DeliveryHandlersTable deliveryHandlers={deliveryHandlers} onChange={fetchDeliveryHandlers} />
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryPage;