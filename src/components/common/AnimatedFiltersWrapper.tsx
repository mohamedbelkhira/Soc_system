import React, { useState, useRef, useEffect } from "react";
// import { Card } from "@/components/ui/card";

interface AnimatedFiltersWrapperProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export default function AnimatedFiltersWrapper({ 
  children, 
  isVisible
}: AnimatedFiltersWrapperProps) {
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isVisible, children]);

  return (
    <div 
      className="overflow-hidden transition-all duration-300 ease-in-out mb-6" 
      style={{ height: `${height}px` }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}