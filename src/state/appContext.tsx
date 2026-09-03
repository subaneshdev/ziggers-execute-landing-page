import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { AppState, initialAppState, appReducer, AppStoreController } from './appStore';

interface AppContextType {
  state: AppState;
  actions: AppStoreController;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  const actions = useMemo(
    () => new AppStoreController(dispatch),
    [dispatch]
  );

  useEffect(() => {
    actions.initializeApp();
  }, [actions]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppStore(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
