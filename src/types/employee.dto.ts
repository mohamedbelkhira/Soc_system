
        import z from 'zod';
        import {
        createEmployeeSchema,
        updateEmployeeSchema,
        deleteEmployeeSchema,
        } from '@/schemas/employee.schema';

        export interface Employee {
        id: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        isActive: boolean;
        jobId: string;
        userId?: string;
        job: {
            id: string;
            name: string;
            description: string;
        };
        user?: {
            id: string;
            username: string;
            roleId: string;
            isActive: boolean;
            role: {
            id: string;
            name: string;
            };
        };
        createdAt: string;
        updatedAt: string;
        }

        export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;
        export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;
        export type DeleteEmployeeDTO = z.infer<typeof deleteEmployeeSchema>;