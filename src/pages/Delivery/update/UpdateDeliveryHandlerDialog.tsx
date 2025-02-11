// src/components/UpdateDeliveryHandlerDialog.tsx

import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateDeliveryHandlerDTO, updateDeliveryHandlerSchema, DeliveryHandler, UpdateDeliveryHandlerAPIPayload } from '@/types/deliveryHandler.dto';
import { deliveryHandlersApi } from '@/api/deliveryHandler.api';
import { showToast } from '@/utils/showToast';
import CustomDialog from '@/components/common/CustomDialog';
import { Edit3 } from 'lucide-react'; // Assuming you use lucide-react for icons
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import { employeesApi } from '@/api/employees.api';
import { Employee } from '@/types/employee.dto';
import { UpdateAgencyDTO } from '@/types/agency.dto';
import { agenciesApi } from '@/api/agency.api';
interface UpdateDeliveryHandlerDialogProps {
  deliveryHandler: DeliveryHandler;
  onUpdate: () => void;
}

const UpdateDeliveryHandlerDialog: React.FC<UpdateDeliveryHandlerDialogProps> = ({
  deliveryHandler,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const form = useForm<UpdateDeliveryHandlerDTO>({
    resolver: zodResolver(updateDeliveryHandlerSchema),
    defaultValues: {
      id: deliveryHandler.id,
      type: deliveryHandler.type,
      deliveryCost: deliveryHandler.deliveryCost,
      returnCost: deliveryHandler.returnCost,
      isActive: deliveryHandler.isActive,
      // Conditional fields will be handled below
      employeeId: deliveryHandler.employeeId,
      agencyName: deliveryHandler.agency?.name || '',
      agencyPhoneNumber: deliveryHandler.agency?.phoneNumber || '',
      agencyAddress: deliveryHandler.agency?.address || '',
    },
    mode: 'onChange',
  });

  const { watch } = form;
  const selectedType = watch('type');

  useEffect(() => {
    if (isOpen && selectedType === 'EMPLOYEE') {
      fetchEmployees();
    }
  
    // Reset form fields when dialog is closed
    if (!isOpen) {
      if (deliveryHandler.type === 'EMPLOYEE') {
        form.reset({
          id: deliveryHandler.id,
          type: deliveryHandler.type,
          deliveryCost: deliveryHandler.deliveryCost,
          returnCost: deliveryHandler.returnCost,
          isActive: deliveryHandler.isActive,
          employeeId: deliveryHandler.employeeId,
        });
      } else if (deliveryHandler.type === 'AGENCY') {
        form.reset({
          id: deliveryHandler.id,
          type: deliveryHandler.type,
          deliveryCost: deliveryHandler.deliveryCost,
          returnCost: deliveryHandler.returnCost,
          isActive: deliveryHandler.isActive,
          agencyId: deliveryHandler.agencyId!,
          agencyName: deliveryHandler.agency?.name || '',
          agencyPhoneNumber: deliveryHandler.agency?.phoneNumber || '',
          agencyAddress: deliveryHandler.agency?.address || '',
        });
      }
  
      setEmployeesError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  
  // Fetch Employees for 'EMPLOYEE' type
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    setEmployeesError(null);
    try {
      const response = await employeesApi.getAll();
      if (response.status === 'success') {
        setEmployees(response.data);
      } else {
        setEmployeesError(response.message || 'Failed to fetch employees');
        showToast('error', response.message || 'Failed to fetch employees');
      }
    } catch (error) {
      setEmployeesError('An error occurred while fetching employees');
      showToast('error', 'An error occurred while fetching employees');
      console.error(error);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const handleSubmitForm = async (data: UpdateDeliveryHandlerDTO) => {
    setIsSubmitting(true);
    try {
      // Start by constructing the common payload fields
      let payload: UpdateDeliveryHandlerAPIPayload;
      if (data.type === 'EMPLOYEE') {
        // For EMPLOYEE type, construct the payload accordingly
        payload = {
          type: 'EMPLOYEE',
          id: data.id,
          employeeId: data.employeeId,
          deliveryCost: data.deliveryCost,
          returnCost: data.returnCost,
          isActive: data.isActive,
        };
      } else if (data.type === 'AGENCY') {
        // For AGENCY type, first update the agency details
        const agencyPayload: UpdateAgencyDTO = {
          id: deliveryHandler.agencyId!, // Non-null assertion since agencyId is required
          name: data.agencyName,
          phoneNumber: data.agencyPhoneNumber,
          address: data.agencyAddress,
        };
  
        console.log("payload data ", deliveryHandler);
        console.log("payloadagency", agencyPayload);
  
        // Update the agency first
        const agencyResponse = await agenciesApi.update(agencyPayload.id, agencyPayload);
  
        if (agencyResponse.status === 'success') {
          // If agency update is successful, construct the payload
          payload = {
            type: 'AGENCY',
            id: data.id,
            agencyId: data.agencyId!, // Non-null assertion since agencyId is required
            deliveryCost: data.deliveryCost,
            returnCost: data.returnCost,
            isActive: data.isActive,
          };
        } else {
          // If agency update fails, show an error and abort
          showToast('error', agencyResponse.message || 'Échec de la mise à jour de l\'agence');
          return; // Prevent further execution if agency update fails
        }
      } else {
        // Handle unexpected type values
        showToast('error', 'Type de Delivery Handler non valide');
        return;
      }
  
      console.log("payload", payload);
  
      // Proceed to update the Delivery Handler
      const response = await deliveryHandlersApi.update(payload.id, payload);
  
      if (response.status === 'success') {
        showToast('success', response.message);
        setIsOpen(false);
        onUpdate();
      } else {
        showToast('error', response.message || 'Échec de la mise à jour du Livreur');
      }
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        err.response?.data.message ?? "Échec de la mise à jour du Livreur"
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon">
          <Edit3 className="h-4 w-4 text-primary" />
        </Button>
      }
      title="Modifier un Livreur"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Hidden ID Field */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type Display (Read-Only) */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Delivery Handler</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional Fields Based on Type */}
          {selectedType === 'EMPLOYEE' && (
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingEmployees}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingEmployees ? 'Chargement...' : 'Sélectionner un employé'} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {isLoadingEmployees ? (
                          <SelectItem value="loading" disabled>
                            Chargement...
                          </SelectItem>
                        ) : employees.length > 0 ? (
                          employees.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id}
                              className="dark:text-white dark:focus:bg-slate-700 dark:hover:bg-slate-700"
                            >
                              {`${employee.lastName} ${employee.firstName}`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-employees" disabled>
                            Aucun employé trouvé
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedType === 'AGENCY' && (
            <>
              {/* Agency Name */}
              <FormField
                control={form.control}
                name="agencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'Agence</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'agence" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Agency Phone Number */}
              <FormField
                control={form.control}
                name="agencyPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Agency Address */}
              <FormField
                control={form.control}
                name="agencyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Adresse de l'agence" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Common Fields */}
          <FormField
            control={form.control}
            name="deliveryCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coût de Livraison</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="Ex: 10.50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coût de Retour</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="Ex: 5.25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label>Actif</Label>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Display employeesError if exists */}
          {employeesError && (
            <div className="text-red-500 text-sm">
              {employeesError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={ isSubmitting}
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default UpdateDeliveryHandlerDialog;
