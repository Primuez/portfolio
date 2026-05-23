'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type ModalType = 'form' | 'cert' | 'workflow' | null;

interface UIContextType {
  isMobile: boolean;
  modalType: ModalType;
  setModalType: (type: ModalType) => void;
  certData: any;
  setCertData: (data: any) => void;
  scrolled: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [certData, setCertData] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <UIContext.Provider value={{ 
      isMobile, 
      modalType, 
      setModalType, 
      certData, 
      setCertData,
      scrolled 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
