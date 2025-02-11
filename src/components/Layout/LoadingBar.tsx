import * as React from "react"

const LoadingBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <div className="h-full bg-blue-500 dark:bg-blue-300 animate-loadingBar"></div>
    </div>
  );
};

export default LoadingBar;