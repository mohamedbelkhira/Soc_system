// src/components/SecurityBulletinForm.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TextareaSection } from './TextareaSection';
import { HeaderTable } from './HeaderTable';
import { InfoTable } from './InfoTable';
import { CriticalitySelector } from './CriticalitySelector';
import { ExportButton } from './ExportButton';
import { SecurityBulletinData, DEFAULT_BULLETIN_DATA } from '../types/SecurityBulletin';

const SecurityBulletinForm: React.FC = () => {
  const [formData, setFormData] = useState<SecurityBulletinData>(DEFAULT_BULLETIN_DATA);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle criticality change
  const handleCriticalityChange = (value: string): void => {
    setFormData(prev => ({
      ...prev,
      criticality: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Bulletin d'alerte - Éditeur</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Header Information */}
          <HeaderTable 
            reference={formData.reference}
            date={formData.date}
            version={formData.version}
            alertDate={formData.alertDate}
            onChange={handleInputChange}
          />

          {/* Main Info */}
          <InfoTable 
            title={formData.title}
            source={formData.source}
            products={formData.products}
            onChange={handleInputChange}
          />

          {/* Criticality */}
          <CriticalitySelector 
            value={formData.criticality}
            onChange={handleCriticalityChange}
          />

          {/* Text Sections */}
          <TextareaSection
            label="Résumé :"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
          />
          
          <TextareaSection
            label="Risque(s) et impact(s) :"
            name="risks"
            value={formData.risks}
            onChange={handleInputChange}
          />
          
          <TextareaSection
            label="Produits concernés :"
            name="affectedProducts"
            value={formData.affectedProducts}
            onChange={handleInputChange}
          />
          
          <TextareaSection
            label="Conditions d'Exploitation :"
            name="exploitationConditions"
            value={formData.exploitationConditions}
            onChange={handleInputChange}
          />
          
          <TextareaSection
            label="Détection :"
            name="detection"
            value={formData.detection}
            onChange={handleInputChange}
          />
          
          <TextareaSection
            label="Actions à entreprendre :"
            name="actions"
            value={formData.actions}
            onChange={handleInputChange}
          />
          
          <TextareaSection
            label="Documentation :"
            name="documentation"
            value={formData.documentation}
            onChange={handleInputChange}
          />
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <ExportButton data={formData} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecurityBulletinForm;