import React, { createContext, useContext, useState } from 'react';

type AcademicContextType = {
  currentContext: string;
  setCurrentContext: (context: string) => void;
};

const AcademicContext = createContext<AcademicContextType>({
  currentContext: 'Overall',
  setCurrentContext: () => {},
});

export const useAcademic = () => useContext(AcademicContext);

export const AcademicProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentContext, setCurrentContext] = useState('Overall');

  return (
    <AcademicContext.Provider value={{ currentContext, setCurrentContext }}>
      {children}
    </AcademicContext.Provider>
  );
};
