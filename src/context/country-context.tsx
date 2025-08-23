"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';
//custom
import { Country } from '@/lib/types';

// Interface for the context value
interface CountryContextType {
  countries: Country[];
  selectedCountry: Country;
  setSelectedCountry: React.Dispatch<React.SetStateAction<Country>>;
}

// Create the context with a default undefined value
// We'll handle the undefined case in the provider and custom hook
const CountryContext = createContext<CountryContextType | undefined>(undefined);

// Custom hook to use the CountryContext
export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

// Provider component props
interface CountryProviderProps {
  children: ReactNode;
}

// Provider component
export const CountryProvider: React.FC<CountryProviderProps> = ({ children }) => {
  const countries = [{
    name: "Kenya",
    code: "KE",
  }, {
    name: "Rwanda",
    code: "RW",
  }, {
    name: "Indonesia",
    code: "ID",
  }];
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const value = {
    countries,
    selectedCountry,
    setSelectedCountry,
  };

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
};

export default CountryContext;
