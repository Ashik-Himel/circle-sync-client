import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from "../firebase.config";

export const UserProvider = createContext(null);

const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setUserLoaded(true);
    });
    return () => unSubscribe(); 
  }, []);

  const value = {
    user,
    setUser,
    userLoaded
  };
  return (
    <UserProvider.Provider value={value}>
      {children}
    </UserProvider.Provider>
  );
};

export default ContextProvider;

ContextProvider.propTypes = {
  children: PropTypes.node
}