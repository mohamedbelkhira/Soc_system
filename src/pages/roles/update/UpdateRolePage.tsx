
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateRoleSchema } from '@/schemas/role.schema';
import { UpdateRoleDTO, RoleResponse } from '@/types/role.dto';
import { rolesApi } from '@/api/roles.api';
import { showToast } from '@/utils/showToast';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionsTable from '@/components/PermissionsTable';
import Loading from '@/components/common/Loading'; // Import the Loading component

const UpdateRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const form = useForm<UpdateRoleDTO>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      id: id || '',
      name: '',
      description: '',
      permissions: [],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      const fetchRole = async () => {
        try {
          const response = await rolesApi.getById(id);
          if (response.status === 'success' && response.data) {
            const role: RoleResponse = response.data;
            form.reset({
              id: role.id,
              name: role.name,
              description: role.description || '',
              permissions: role.permissions, // Ensure permissions are strings
            });
          } else {
            showToast('error', response.message || 'Erreur lors du chargement du rôle');
            navigate('/roles');
          }
        } catch (error) {
          showToast('error', 'Erreur de connexion');
          console.error('Failed to fetch role:', error);
          navigate('/roles');
        } finally {
          setIsLoading(false);
        }
      };

      fetchRole();
    } else {
      showToast('error', 'ID de rôle manquant');
      navigate('/roles');
    }
  }, [id, form, navigate]);

  const handleSubmitForm = async (values: UpdateRoleDTO) => {
    try {
      const response = await rolesApi.update(values.id, values);
      if (response.status === 'success') {
        showToast('success', response.message || 'Rôle mis à jour avec succès');
        navigate('/roles');
      } else {
        showToast('error', response.message || 'Erreur lors de la mise à jour du rôle');
      }
    } catch (error) {
      showToast('error', 'Erreur lors de la mise à jour du rôle');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <Loading /> {/* Display the Loading component */}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Modifier le Rôle</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
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
              <Button variant="outline" type="button" onClick={() => navigate('/roles')}>
                Annuler
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateRolePage;