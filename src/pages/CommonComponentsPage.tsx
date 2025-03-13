import React from 'react';

import SecurityBulletinForm from '@/components/SecurityBulletinForm';

const CommonComponentsPage: React.FC = () => {
 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Common Components Showcase</h1>
     
      <SecurityBulletinForm />
    </div>
  );
};

export default CommonComponentsPage;
