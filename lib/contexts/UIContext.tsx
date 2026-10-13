'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';

export type ModalType = 'form' | 'cert' | 'workflow' | null;

export interface UIState {
  isMobile: boolean;
  modalType: ModalType;
  certData: any;
  scrolled: boolean;
}

let state: UIState = {
  isMobile: false,
  modalType: null,
  certData: null,
  scrolled: false,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const uiStore = {
  getState() {
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setModalType(type: ModalType) {
    state = { ...state, modalType: type };
    emitChange();
  },
  setCertData(data: any) {
    state = { ...state, certData: data };
    emitChange();
  },
  setScrolled(scrolled: boolean) {
    if (state.scrolled !== scrolled) {
      state = { ...state, scrolled };
      emitChange();
    }
  },
  setIsMobile(isMobile: boolean) {
    if (state.isMobile !== isMobile) {
      state = { ...state, isMobile };
      emitChange();
    }
  },
};

// Global scroll and resize listeners in browser
if (typeof window !== 'undefined') {
  const checkMobile = () => {
    uiStore.setIsMobile(window.innerWidth < 768);
  };
  const checkScroll = () => {
    uiStore.setScrolled(window.scrollY > 50);
  };
  checkMobile();
  checkScroll();
  window.addEventListener('resize', checkMobile, { passive: true });
  window.addEventListener('scroll', checkScroll, { passive: true });
}

export interface UIContextType {
  isMobile: boolean;
  modalType: ModalType;
  setModalType: (type: ModalType) => void;
  certData: any;
  setCertData: (data: any) => void;
  scrolled: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const snapshot = useSyncExternalStore(
    uiStore.subscribe,
    uiStore.getState,
    () => state
  );

  return (
    <UIContext.Provider
      value={{
        isMobile: snapshot.isMobile,
        modalType: snapshot.modalType,
        setModalType: uiStore.setModalType,
        certData: snapshot.certData,
        setCertData: uiStore.setCertData,
        scrolled: snapshot.scrolled,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context !== undefined) {
    return context;
  }
  // Fallback if rendered outside UIProvider (e.g. across Astro island boundaries)
  const snapshot = useSyncExternalStore(
    uiStore.subscribe,
    uiStore.getState,
    () => state
  );
  return {
    isMobile: snapshot.isMobile,
    modalType: snapshot.modalType,
    setModalType: uiStore.setModalType,
    certData: snapshot.certData,
    setCertData: uiStore.setCertData,
    scrolled: snapshot.scrolled,
  };
};
