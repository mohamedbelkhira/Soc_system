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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeesApi } from '@/api/employees.api';
import { jobsApi } from '@/api/jobs.api';
import { rolesApi } from '@/api/roles.api';
import { CreateEmployeeDTO } from '@/types/employee.dto';
import { Job } from '@/types/job.dto';
import { RoleResponse } from '@/types/role.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import CustomDialog from '@/components/common/CustomDialog';
import { createEmployeeSchema } from '@/schemas/employee.schema';
import { Label } from '@/components/ui/label';
import AddButton from '@/components/common/AddButton';
interface CreateEmployeeDialogProps {
  onAdd: () => void;
  jobs: Job[];
}

export function CreateEmployeeDialog({ onAdd }: CreateEmployeeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [createAccount, setCreateAccount] = useState(false);

  const form = useForm<CreateEmployeeDTO>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      jobId: '',
      isActive: true,
      user: undefined,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setCreateAccount(false);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (!createAccount) {
      form.setValue('user', undefined);
      form.clearErrors('user');
    }
  }, [createAccount, form]);

  useEffect(() => {
    fetchJobs();
    fetchRoles();
  }, [onAdd]);

  const fetchJobs = async () => {
    try {
      const data = await jobsApi.getAll();
      setJobs(data.data);
    } catch (error) {
      showToast('error', 'Erreur de connexion');
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(data.data);
    } catch (error) {
      showToast('error', 'Erreur de connexion');
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleSubmit = async (values: CreateEmployeeDTO) => {
    const submitData = {
      ...values,
      user: createAccount ? values.user : undefined,
    };

    setIsSubmitting(true);
    try {
      const response = await employeesApi.create(submitData);
      showToast(response.status, response.message);
      setIsOpen(false);
      onAdd();
      form.reset();
      setCreateAccount(false);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? 'Échec de la création de l\'employé'
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={ <AddButton label=" Ajouter un Employé" />}
      title="Créer un nouvel employé"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-slate-200">Prénom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Prénom de l'employé" 
                      className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-slate-200">Nom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nom de l'employé" 
                      className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-slate-200">Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Numéro de téléphone" 
                    className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-slate-200">Poste</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                      <SelectValue placeholder="Sélectionner un poste" className="dark:text-slate-400" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    {jobs.map((job) => (
                      <SelectItem 
                        key={job.id} 
                        value={job.id}
                        className="dark:text-white dark:focus:bg-slate-700 dark:hover:bg-slate-700"
                      >
                        {job.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="dark:text-red-400" />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2">
            <Switch
              checked={createAccount}
              onCheckedChange={setCreateAccount}
              className="dark:bg-slate-700"
            />
            <Label className="dark:text-slate-200">Créer un compte utilisateur</Label>
          </div>
          {createAccount && (
            <>
              <FormField
                control={form.control}
                name="user.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-200">Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nom d'utilisateur" 
                        className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-200">Mot de passe</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Mot de passe" 
                        className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-400"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-200">Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                          <SelectValue placeholder="Sélectionner un rôle" className="dark:text-slate-400" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {roles.map((role) => (
                          <SelectItem 
                            key={role.id} 
                            value={role.id}
                            className="dark:text-white dark:focus:bg-slate-700 dark:hover:bg-slate-700"
                          >
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
            </>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.formState.isValid}
              className="dark:bg-primary dark:hover:bg-slate-600"
            >
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateEmployeeDialog;