import React from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface HeaderTableProps {
  reference: string;
  date: string;
  version: string;
  alertDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HeaderTable: React.FC<HeaderTableProps> = ({
  reference,
  date,
  version,
  alertDate,
  onChange
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium w-1/4">Référence</TableCell>
            <TableCell className="w-1/4">
              <Input
                name="reference"
                value={reference}
                onChange={onChange}
              />
            </TableCell>
            <TableCell className="font-medium w-1/4">Version alerte</TableCell>
            <TableCell className="w-1/4">
              <Input
                name="version"
                value={version}
                onChange={onChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Date</TableCell>
            <TableCell>
              <Input
                name="date"
                value={date}
                onChange={onChange}
              />
            </TableCell>
            <TableCell className="font-medium">Date alerte</TableCell>
            <TableCell>
              <Input
                name="alertDate"
                value={alertDate}
                onChange={onChange}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
