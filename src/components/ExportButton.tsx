import React from 'react';
import { Button } from "@/components/ui/button";
import { SecurityBulletinData } from '../types/SecurityBulletin';
import { exportToDocx } from '../utils/docx-utils';

interface ExportButtonProps {
  data: SecurityBulletinData;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const handleExport = async () => {
    try {
      await exportToDocx(data);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Une erreur est survenue lors de l\'exportation du document.');
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      className="bg-blue-600 hover:bg-blue-700"
    >
      Exporter en DOCX
    </Button>
  );
};