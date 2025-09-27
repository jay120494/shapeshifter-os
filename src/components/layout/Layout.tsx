import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  onOpenCustomizations?: () => void;
  onOpenSkins?: () => void;
  setCustomizationsHandler: (handler: () => void) => void;
  setSkinsHandler: (handler: () => void) => void;
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
  const [onOpenSkins, setOnOpenSkins] = useState<(() => void) | undefined>();

  const setCustomizationsHandler = (handler: () => void) => {
    setOnOpenCustomizations(() => handler);
  };

  const setSkinsHandler = (handler: () => void) => {
    setOnOpenSkins(() => handler);
  };

  const contextValue: LayoutContextType = {
    onOpenCustomizations,
    onOpenSkins,
    setCustomizationsHandler,
    setSkinsHandler,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        <Header
          onOpenCustomizations={onOpenCustomizations}
          onOpenSkins={onOpenSkins}
        />
        <main>{children}</main>
      </div>
    </LayoutContext.Provider>
  );
}