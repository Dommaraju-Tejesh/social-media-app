import React, { createContext, useContext, useState } from "react";

const AuthFlowContext = createContext();

export const AuthFlowProvider = ({ children }) => {
  const [introPlayed, setIntroPlayed] = useState(false);

  return (
    <AuthFlowContext.Provider
      value={{
        introPlayed,
        setIntroPlayed,
      }}
    >
      {children}
    </AuthFlowContext.Provider>
  );
};

export const useAuthFlow = () => {
  return useContext(AuthFlowContext);
};