import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from "../firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";
import toast from "react-hot-toast";

export const UserProvider = createContext(null);

const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      if (user?.email) {
        axiosPublic.post('/users', {email: user?.email, setToken: false}, {withCredentials: true})
          .then(res => {
            setUserRole(res.data?.role);
            setUserLoaded(true);
          })
          .catch(error => toast.error(error.message))
      }
    });
    return () => unSubscribe(); 
  }, [axiosPublic]);

  const value = {
    user,
    setUser,
    userLoaded,
    userRole,
    setUserRole
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