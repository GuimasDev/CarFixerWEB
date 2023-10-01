import React, { createContext, useContext, useState, useEffect } from 'react';

const UserTypeContext = createContext();

export function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState(localStorage.getItem('userType') || 'unsigned');

  // Efeito para atualizar o localStorage sempre que o userType for alterado
  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  return useContext(UserTypeContext);
}
