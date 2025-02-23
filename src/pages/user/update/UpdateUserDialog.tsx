// src/pages/users/update/UpdateUserDialog.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/common/CustomDialog";
import { UpdateUserDTO } from "@/dto/user.dto";
import { updateUserSchema } from "@/schemas/user.schema";
import { usersApi } from "@/api/user.api";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import UpdateAction from "@/components/common/actions/UpdateAction";
import { UserResponse } from "@/dto/user.dto";
import { rolesApi } from "@/api/roles.api";
import { RoleResponse } from "@/types/role.dto";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function UpdateUserDialog({
  user,
  onUpdate,
}: {
  user: UserResponse;
  onUpdate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>([]);

  // Fetch available roles on mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await rolesApi.getAll();
        if (response.status === "success") {
          setRoles(response.data);
        } else {
          showToast("error", response.message || "Error loading roles");
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        showToast("error", "Failed to load roles");
      }
    }
    fetchRoles();
  }, []);

  const form = useForm<UpdateUserDTO>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      username: user.username,
      password: "",
      roleId: user.roleId,
      isActive: user.isActive,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: user.id,
        username: user.username,
        password: "",
        roleId: user.roleId,
        isActive: user.isActive,
      });
    }
  }, [isOpen, user, form]);

  const onSubmit = async (values: UpdateUserDTO) => {
    // Remove password if it's an empty string
    const payload = { 
      ...values, 
      password: values.password === "" ? undefined : values.password 
    };
  
    setIsSubmitting(true);
    try {
      const response = await usersApi.update(user.id, payload);
      showToast(response.status, response.message);
      setIsOpen(false);
      onUpdate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message || "Failed to update user"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Update User"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Dropdown using custom Radix Select */}
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active Switch */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default UpdateUserDialog;
