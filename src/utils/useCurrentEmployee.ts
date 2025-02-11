import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-provider';
import { employeesApi } from '@/api/employees.api';
import { Employee } from '@/types/employee.dto';

export const useCurrentEmployee = () => {
  const { user, isAuthenticated } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  console.log('employeesApi:', employeesApi); // Add this line

  const fetchEmployee = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setEmployee(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await employeesApi.getByUserId(user.userId);
      setEmployee(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch employee'));
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, isAuthenticated]);

  useEffect(() => {
    setIsLoading(true);
    fetchEmployee();
  }, [fetchEmployee]);

  return {
    employee,
    isLoading,
    error,
    refetch: fetchEmployee
  };
};
