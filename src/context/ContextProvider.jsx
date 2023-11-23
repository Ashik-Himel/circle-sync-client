import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const UserProvider = createContext(null);

const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(true);

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