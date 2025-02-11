
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoleSchema } from '@/schemas/role.schema';
import { CreateRoleDTO } from '@/types/role.dto';
import { rolesApi } from '@/api/roles.api';
import { showToast } from '@/utils/showToast';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PermissionsTable from '@/components/PermissionsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import handleError from '@/utils/handleError';

const CreateRolePage: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<CreateRoleDTO>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
    mode: 'onChange',
  });

  const handleSubmit = async (values: CreateRoleDTO) => {
    try {
      const response = await rolesApi.create(values);
      console.log("request values", values);
      showToast(response.status, response.message);
      navigate('/roles');
    } catch (error) {
      handleError(error, "Échec de la création de l'achat");
      
    }
  };

  return (
    <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Créer un Rôle</CardTitle>
      
    </CardHeader>
    <CardContent>
  
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            {/* Role Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Rôle</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du rôle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description du rôle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions Field */}
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <FormControl>
                    <PermissionsTable
                      selectedPermissions={field.value || []}
                      onChange={(perms) => field.onChange(perms)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate('/roles')}>
                Annuler
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                Créer
              </Button>
            </div>
          </div>
        </form>
      </Form>
   
    </CardContent>
  </Card>
   
  );
};

export default CreateRolePage;