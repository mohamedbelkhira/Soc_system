// src/components/InfoTable.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface InfoTableProps {
  title: string;
  source: string;
  products: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InfoTable: React.FC<InfoTableProps> = ({
  title,
  source,
  products,
  onChange
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium w-1/4">Titre</TableCell>
            <TableCell className="w-3/4">
              <Input
                name="title"
                value={title}
                onChange={onChange}
              
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Source(s)</TableCell>
            <TableCell>
              <Input
                name="source"
                value={source}
                onChange={onChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Produits concernés</TableCell>
            <TableCell>
              <Input
                name="products"
                value={products}
                onChange={onChange}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};