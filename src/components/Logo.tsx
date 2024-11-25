import React from 'react';

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <img 
        src="https://raw.githubusercontent.com/path-synch/path-synch/main/logo.png" 
        alt="PathSynch Logo" 
        className="h-8 w-auto"
      />
      <p className="text-xs text-indigo-200 mt-1">Analytics Dashboard</p>
    </div>
  );
}