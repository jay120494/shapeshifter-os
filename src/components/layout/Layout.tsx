import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  onOpenCustomizations?: () => void;
  onOpenThemes?: () => void;
  setCustomizationsHandler: (handler: () => void) => void;
  setThemesHandler: (handler: () => void) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a Layout');
  }
  return context;
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [onOpenCustomizations, setOnOpenCustomizations] = useState<(() => void) | undefined>();
  const [onOpenThemes, setOnOpenThemes] = useState<(() => void) | undefined>();

  const setCustomizationsHandler = (handler: () => void) => {
    setOnOpenCustomizations(() => handler);
  };

  const setThemesHandler = (handler: () => void) => {
    setOnOpenThemes(() => handler);
  };

  const contextValue: LayoutContextType = {
    onOpenCustomizations,
    onOpenThemes,
    setCustomizationsHandler,
    setThemesHandler,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        <Header
          onOpenCustomizations={onOpenCustomizations}
          onOpenThemes={onOpenThemes}
        />
        <main>{children}</main>
      </div>
    </LayoutContext.Provider>
  );
}