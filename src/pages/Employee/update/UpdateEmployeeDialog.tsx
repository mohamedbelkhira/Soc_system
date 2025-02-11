import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { employeesApi } from '@/api/employees.api';
import { jobsApi } from '@/api/jobs.api';
import { rolesApi } from '@/api/roles.api';
import { Employee } from '@/types/employee.dto';
import { Job } from '@/types/job.dto';
import { RoleResponse } from '@/types/role.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import CustomDialog from '@/components/common/CustomDialog';
import { Edit3 } from 'lucide-react';

interface UserBase {
  username: string;
  roleId: string;
  isActive?: boolean;
}

interface NewUser extends UserBase {
  password: string;
  id?: never; 
}

interface ExistingUser extends UserBase {
  id: string;
  password?: string;
}

type UserData = NewUser | ExistingUser | undefined;

interface UpdateEmployeeDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  jobId: string;
  isActive?: boolean;
  user?: UserData;
}

interface UpdateEmployeeApiDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  jobId?: string;
  isActive?: boolean;
  user?: {
    id?: string;
    isActive?: boolean;
    username?: string;
    password?: string;
    roleId?: string;
  };
}

const userCreateSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  roleId: z.string().uuid("ID de rôle non valide"),
  isActive: z.boolean().optional().default(true),
});

const userUpdateSchema = z.object({
    id: z.string().uuid().optional(),
    username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
    password: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || val === '' || val.length >= 6,
        {
          message: "Le mot de passe doit comporter au moins 6 caractères",
        }
      ),
    roleId: z.string().nonempty("Veuillez sélectionner un rôle").uuid("ID de rôle non valide"),
    isActive: z.boolean().optional(),
  });
const updateEmployeeSchema = (hasAccount: boolean, isExistingUser: boolean) => 
  z.object({
    id: z.string().uuid("ID d'employé non valide"),
    firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
    phoneNumber: z.string().regex(/^0\d{9}$/, "Format de numéro de téléphone invalide"),
    jobId: z.string().uuid("ID de poste non valide"),
    isActive: z.boolean().optional(),
    user: hasAccount 
      ? (isExistingUser ? userUpdateSchema : userCreateSchema)
      : z.undefined(),
  });

interface UpdateEmployeeDialogProps {
  employee: Employee;
  onUpdate: () => void;
}

const UpdateEmployeeDialog: React.FC<UpdateEmployeeDialogProps> = ({
  employee,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [hasAccount, setHasAccount] = useState(!!employee.user);

  const form = useForm<UpdateEmployeeDTO>({
    resolver: zodResolver(updateEmployeeSchema(hasAccount, !!employee.user)),
    defaultValues: {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber,
      jobId: employee.jobId,
      isActive: employee.isActive,
      user: employee.user
        ? {
            id: employee.user.id,
            username: employee.user.username,
            password: '',
            roleId: employee.user.roleId,
            isActive: employee.user.isActive,
          }
        : undefined,
    },
    mode: 'onChange',
  });

  const { formState: { isValid } } = form;

 
useEffect(() => {
    fetchJobs();
    fetchRoles();
  }, []);
  
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

  useEffect(() => {
    if (isOpen) {
      setHasAccount(!!employee.user);
      form.reset({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        phoneNumber: employee.phoneNumber,
        jobId: employee.jobId,
        isActive: employee.isActive,
        user: employee.user
          ? {
              id: employee.user.id,
              username: employee.user.username,
              password: '',
              roleId: employee.user.roleId,
              isActive: employee.user.isActive,
            }
          : undefined,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (hasAccount && !form.getValues('user')) {
      const newUserData: NewUser = {
        username: '',
        password: '',
        roleId: roles[0]?.id || '',
        isActive: true,
      };
      form.setValue('user', newUserData, { shouldValidate: true });
    } else if (!hasAccount) {
      form.setValue('user', undefined, { shouldValidate: true });
    }
  }, [hasAccount, roles]);

 

  const handleSubmit = async (values: UpdateEmployeeDTO) => {
    setIsSubmitting(true);
  
    try {
      const submissionData = JSON.parse(JSON.stringify(values));
  
      const apiSubmissionData: UpdateEmployeeApiDTO = {
        ...submissionData,
        user: undefined,
      };
  
      if (hasAccount) {
        if (employee.user) {
          // Existing user case
          apiSubmissionData.user = {
            id: employee.user.id,
            username: submissionData.user?.username,
            roleId: submissionData.user?.roleId,
            isActive: submissionData.user?.isActive,
          };
  
          if (submissionData.user?.password && submissionData.user.password !== '') {
            apiSubmissionData.user.password = submissionData.user.password;
          }
        } else {
          // New user case
          apiSubmissionData.user = {
            username: submissionData.user?.username || '',
            password: (submissionData.user as NewUser)?.password || '',
            roleId: submissionData.user?.roleId || '',
            isActive: submissionData.user?.isActive,
          };
        }
      }
      console.log("data", apiSubmissionData);
      const response = await employeesApi.update(employee.id, apiSubmissionData);
      showToast(response.status, response.message);
      setIsOpen(false);
      onUpdate();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? "Échec de la mise à jour de l'employé"
      );
      console.error(error);
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
      title="Modifier un employé"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom de l'employé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'employé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" text-foreground">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poste</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="employee-isActive"
                  />
                </FormControl>
                <FormLabel htmlFor="employee-isActive">Actif</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="flex items-center space-x-2 text-foreground">
            <Switch
              checked={hasAccount}
              onCheckedChange={(checked) => setHasAccount(checked)}
              disabled={!!employee.user}
            />
            <FormLabel>Compte utilisateur</FormLabel>
          </div>
          {hasAccount && (
            <>
            <div className='text-foreground'>
              <FormField
                control={form.control}
                name="user.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>
                        {employee.user
                        ? "Nouveau mot de passe (laisser vide pour conserver l'ancien)"
                        : 'Mot de passe'}
                    </FormLabel>
                    <FormControl>
                        <Input
                        type="password"
                        placeholder={employee.user ? 'Laisser vide pour ne pas changer' : 'Mot de passe'}
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

              <FormField
                control={form.control}
                name="user.roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                       checked={field.value ?? true} 
                       onCheckedChange={(checked) => field.onChange(checked ?? false)}
                       id="user-isActive"
                      />
                    </FormControl>
                    <FormLabel htmlFor="user-isActive">Compte Actif</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 text-foreground ">
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
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default UpdateEmployeeDialog;