import { useContext } from "react";
import { UserProvider } from "../context/ContextProvider";

const useUserContext = () => {
  const userContext = useContext(UserProvider);

  return userContext;
};

export default useUserContext;