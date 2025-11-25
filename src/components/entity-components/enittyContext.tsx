"use client";
import React, { createContext, useContext, useState } from "react";

interface EntityContextType {
  selectedEntityId: string | null;
  setSelectedEntityId: (id: string | null) => void;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedEntityId, setSelectedEntityIdState] = useState<string | null>(
    () =>
      typeof window !== "undefined"
        ? sessionStorage.getItem("selectedEntityId")
        : null
  );

  const setSelectedEntityId = (id: string | null) => {
    setSelectedEntityIdState(id);
    if (id) {
      sessionStorage.setItem("selectedEntityId", id);
    } else {
      sessionStorage.removeItem("selectedEntityId");
    }
  };

  return (
    <EntityContext.Provider value={{ selectedEntityId, setSelectedEntityId }}>
      {children}
    </EntityContext.Provider>
  );
};

export const useEntityContext = () => {
  const context = useContext(EntityContext);
  if (!context)
    throw new Error("useEntityContext must be used inside EntityProvider");
  return context;
};
