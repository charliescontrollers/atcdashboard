import { createContext, useContext, useState } from "react";

const CatContext = createContext();

export function CatProvider({ children }) {
  const [cat, setCat] = useState({
    label: "CAT I",
    level: "CAT1"
  });

  return (
    <CatContext.Provider value={{ cat, setCat }}>
      {children}
    </CatContext.Provider>
  );
}

export function useCAT() {
  return useContext(CatContext);
}
