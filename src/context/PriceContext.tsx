import { createContext, useState, useContext, ReactNode } from "react";

interface PriceContextType {
  currentPrice: number;
  setCurrentPrice: (price: number) => void;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

interface PriceProviderProps {
  children: ReactNode;
}

export function PriceProvider({ children }: PriceProviderProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  return (
    <PriceContext.Provider value={{ currentPrice, setCurrentPrice, totalPrice, setTotalPrice }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error("usePrice must be used within a PriceProvider");
  }
  return context;
}
