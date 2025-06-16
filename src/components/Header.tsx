import React from 'react';

export function Header() {
  return (
    <header className="border-b border-border py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Split Schema Logo" className="w-10 h-10" />
          <h1 className="text-xl font-medium text-foreground">Split Schema</h1>
        </div>
      </div>
    </header>
  );
} 