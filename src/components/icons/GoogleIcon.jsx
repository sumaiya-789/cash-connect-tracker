
import React from 'react';

const GoogleIcon = ({ className = "h-4 w-4" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
      <path d="M17.5 12H12V7" />
      <path d="M11 12L14.5 15.5" />
    </svg>
  );
};

export default GoogleIcon;
