'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import { type DiagramStore, createDiagramStore } from '../store';

export const DiagramStoreContext = createContext<StoreApi<DiagramStore> | null>(
  null
);

export interface DiagramStoreProviderProps {
  children: ReactNode;
}

export const DiagramStoreProvider = ({
  children,
}: DiagramStoreProviderProps) => {
  const storeRef = useRef<StoreApi<DiagramStore>>();
  if (!storeRef.current) {
    storeRef.current = createDiagramStore();
  }

  return (
    <DiagramStoreProvider.Provider value={storeRef.current}>
      {children}
    </DiagramStoreProvider.Provider>
  );
};

export const useCounterStore = <T,>(
  selector: (store: DiagramStore) => T
): T => {
  const diagramStoreContext = useContext(DiagramStoreContext);

  if (!diagramStoreContext) {
    throw new Error(`useDiagramStore must be use within DiagramStoreProvider`);
  }

  return useStore(diagramStoreContext, selector);
};
