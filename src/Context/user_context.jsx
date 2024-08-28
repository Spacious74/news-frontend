import React, {createContext, useState, useContext} from 'react'
import Cookies from 'universal-cookie';

const UserContext = createContext();
const cookies = new Cookies();
export const UserProvider = ({ children }) =>{
  const [user, setUser ] = useState(null);
  const login_signup = (userData)=>{
    setUser(userData);
  }
  const logout = ()=>{
    setUser(null);
  }
  const isLoggedIn = ()=>{
    const value = cookies.get("authToken");
    if(value){
      return true;
    }else{
      return false;
    }
  }
  return (
    <UserContext.Provider value={{user, login_signup, logout, isLoggedIn}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = ()=>{
  const context = useContext(UserContext);
  if(!context){
    throw new Error("useUserContext must be used within a Provider");
  }
  return context;
}
