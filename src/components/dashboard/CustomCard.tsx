import React, { useState, FC } from 'react';

//this component is for testing purposes 
interface CardProps {
  title?: string;
  onAnimationComplete?: () => void;
}

interface Section {
  type: 'primary' | 'accent' | 'muted';
  text: string;
}

const CustomCard: FC<CardProps> = ({ 
  title = "Custom Styling Demo",
  onAnimationComplete
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sections: Section[] = [
    { type: 'primary', text: 'Primary section with custom colors' },
    { type: 'accent', text: 'Accent section with custom colors' },
    { type: 'muted', text: 'Muted section with custom colors' }
  ];

  const handleClick = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAnimationComplete?.();
    }, 2000);
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <div className="w-full max-w-md">

        <div className="relative overflow-hidden rounded-lg bg-card shadow-card">
          {/* Loading bar */}
          {isLoading && (
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/20">
              <div className="h-full w-full animate-loadingBar bg-primary"></div>
            </div>
          )}
          
          {/* Card header */}
          <div className="border-b border-border bg-sidebar p-6">
            <h3 className="text-2xl font-semibold text-sidebar-foreground">
              {title}
            </h3>
          </div>
          -
          {/* Card content */}
          <div className="space-y-4 p-6">
            {sections.map((section) => (
              <div 
                key={section.type}
                className={`rounded-md bg-${section.type} p-4`}
              >
                <p className={`text-${section.type}-foreground`}>
                  {section.text}
                </p>
              </div>
            ))}
            
            {/* Button */}
            <button
              onClick={handleClick}
              disabled={isLoading}
              className="w-full rounded-md bg-sidebar-primary px-4 py-2 text-sidebar-primary-foreground hover:bg-sidebar-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Trigger Animation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCard;