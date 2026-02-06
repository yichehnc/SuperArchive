import React, { createContext, useContext, useState } from 'react';

export type ViewMode = 'render' | 'wireframe';

export interface CursorData {
  visible: boolean;
  label?: string;
  value?: string;
  subtext?: string;
}

interface UIContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  cursorData: CursorData;
  setCursorData: (data: CursorData) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('render');
  const [cursorData, setCursorData] = useState<CursorData>({ visible: false });

  return (
    <UIContext.Provider value={{ viewMode, setViewMode, cursorData, setCursorData }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
