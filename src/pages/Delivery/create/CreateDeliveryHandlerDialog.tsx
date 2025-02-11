import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { agenciesApi } from "@/api/agency.api";
import { deliveryHandlersApi } from "@/api/deliveryHandler.api";
import { employeesApi } from "@/api/employees.api";
import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Agency, CreateAgencyDTO } from "@/types/agency.dto";
import {
  CreateDeliveryHandlerAGENCY,
  CreateDeliveryHandlerDTO,
  CreateDeliveryHandlerEMPLOYEE,
  createDeliveryHandlerSchema,
} from "@/types/deliveryHandler.dto";
import { CreateDeliveryHandlerAPIPayload } from "@/types/deliveryHandler.dto";
import { Employee } from "@/types/employee.dto";
import { ApiErrorResponse } from "@/types/error.type";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

interface CreateDeliveryHandlerDialogProps {
  onAdd: () => void;
}

interface FormState {
  isLoading: boolean;
  error: string | null;
  dataFetched: boolean;
}

export function CreateDeliveryHandlerDialog({
  onAdd,
}: CreateDeliveryHandlerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [handlerType, setHandlerType] = useState<"EMPLOYEE" | "AGENCY">(
    "EMPLOYEE"
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    dataFetched: false,
  });

  const form = useForm<CreateDeliveryHandlerDTO>({
    resolver: zodResolver(createDeliveryHandlerSchema),
    defaultValues: {
      type: "EMPLOYEE",
      employeeId: "",
      deliveryCost: 0,
      returnCost: 0,
      isActive: true,
      agencyName: "",
      agencyPhoneNumber: "",
      agencyAddress: "",
    },
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset({
      type: "EMPLOYEE",
      employeeId: "",
      deliveryCost: 0,
      returnCost: 0,
      isActive: true,
      agencyName: "",
      agencyPhoneNumber: "",
      agencyAddress: "",
    });
    setHandlerType("EMPLOYEE");
  };

  const fetchEmployees = async () => {
    if (formState.dataFetched) return;

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await employeesApi.getAll();
      if (response.status === "success") {
        setEmployees(response.data);
        setFormState((prev) => ({ ...prev, dataFetched: true }));
      } else {
        throw new Error(response.message || "Failed to fetch employees");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while fetching employees";
      setFormState((prev) => ({ ...prev, error: errorMessage }));
      showToast("error", errorMessage);
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (isOpen && handlerType === "EMPLOYEE") {
      fetchEmployees();
    }
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, handlerType]);

  const isEmployeeHandler = (
    data: CreateDeliveryHandlerDTO
  ): data is CreateDeliveryHandlerEMPLOYEE => {
    return data.type === "EMPLOYEE" && !!data.employeeId;
  };

  const isAgencyHandler = (
    data: CreateDeliveryHandlerDTO
  ): data is CreateDeliveryHandlerAGENCY => {
    return data.type === "AGENCY" && !!data.agencyName && !!data.agencyAddress;
  };

  const handleSubmitForm = async (data: CreateDeliveryHandlerDTO) => {
    try {
      if (data.type === "EMPLOYEE" && isEmployeeHandler(data)) {
        await handleEmployeeSubmission(data);
      } else if (data.type === "AGENCY" && isAgencyHandler(data)) {
        await handleAgencySubmission(data);
      } else {
        throw new Error("Invalid handler type or missing required fields");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création";
      showToast("error", errorMessage);
    }
  };

  const handleEmployeeSubmission = async (
    data: CreateDeliveryHandlerEMPLOYEE
  ) => {
    if (!data.employeeId) {
      showToast("error", "Veuillez sélectionner un employé");
      return;
    }

    const deliveryHandlerPayload: CreateDeliveryHandlerAPIPayload = {
      type: "EMPLOYEE",
      employeeId: data.employeeId,
      deliveryCost: data.deliveryCost,
      returnCost: data.returnCost,
      isActive: data.isActive,
    };

    try {
      const response = await deliveryHandlersApi.create(deliveryHandlerPayload);
      if (response.status === "success") {
        showToast("success", "Livreur créé avec succès");
        setIsOpen(false);
        onAdd();
        resetForm();
      } else {
        showToast(
          "error",
          response.message || "Échec de la création du Delivery Handler"
        );
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        "error",
        error.response?.data.message ??
          "Échec de la création du Delivery Handler"
      );
      console.error(error);
    }
  };

  const handleAgencySubmission = async (data: CreateDeliveryHandlerAGENCY) => {
    const { agencyName, agencyPhoneNumber, agencyAddress } = data;

    const agencyPayload: CreateAgencyDTO = {
      name: agencyName,
      phoneNumber: agencyPhoneNumber,
      address: agencyAddress,
    };

    try {
      const agencyResponse = await agenciesApi.create(agencyPayload);
      if (agencyResponse.status === "success") {
        const newAgency: Agency = agencyResponse.data;

        const deliveryHandlerPayload: CreateDeliveryHandlerAPIPayload = {
          type: "AGENCY",
          agencyId: newAgency.id,
          deliveryCost: data.deliveryCost,
          returnCost: data.returnCost,
          isActive: data.isActive,
        };

        const deliveryHandlerResponse = await deliveryHandlersApi.create(
          deliveryHandlerPayload
        );
        if (deliveryHandlerResponse.status === "success") {
          showToast("success", deliveryHandlerResponse.message);
          setIsOpen(false);
          onAdd();
          resetForm();
        } else {
          showToast(
            "error",
            deliveryHandlerResponse.message ||
              "Échec de la création du Delivery Handler"
          );
        }
      } else {
        showToast(
          "error",
          agencyResponse.message || "Échec de la création de l'agence"
        );
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        "error",
        error.response?.data.message ?? "Échec de la création de l'agence"
      );
      console.error(error);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un Livreur" />}
      title="Ajouter un Livreur"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-4"
          aria-busy={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Delivery Handler</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      setHandlerType(value as "EMPLOYEE" | "AGENCY");
                      field.onChange(value);
                      if (value === "EMPLOYEE") {
                        form.setValue("agencyName", "");
                        form.setValue("agencyPhoneNumber", "");
                        form.setValue("agencyAddress", "");
                      } else if (value === "AGENCY") {
                        form.setValue("employeeId", "");
                      }
                    }}
                    value={field.value}
                    className="flex flex-row gap-4"
                  >
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="EMPLOYEE" />
                      </FormControl>
                      <FormLabel>Employé</FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="AGENCY" />
                      </FormControl>
                      <FormLabel>Agence</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {handlerType === "EMPLOYEE" && (
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
                      disabled={formState.isLoading}
                    >
                      <SelectTrigger className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                        <SelectValue
                          placeholder={
                            formState.isLoading
                              ? "Chargement..."
                              : "Sélectionner un employé"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {formState.isLoading ? (
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
                          <SelectItem value="empty" disabled>
                            Aucun employé disponible
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

          {handlerType === "AGENCY" && (
            <>
              <FormField
                control={form.control}
                name="agencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'Agence</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom de l'agence"
                        className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agencyPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numéro de téléphone"
                        className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agencyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adresse de l'agence"
                        className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

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
                    className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
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
                    className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
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
                    className="dark:bg-slate-700"
                  />
                </FormControl>
                <Label className="dark:text-slate-200">Actif</Label>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={form.formState.isSubmitting}
              className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="dark:bg-primary dark:hover:bg-slate-600"
            >
              {form.formState.isSubmitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateDeliveryHandlerDialog;
