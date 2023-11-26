import { Navigate, useLocation } from "react-router-dom";
import useUserContext from "../hooks/useUserContext";
import PropTypes from 'prop-types';

const PrivateRoutes = ({children}) => {
  const {user, userLoaded} = useUserContext();
  const {pathname} = useLocation();

  if (!userLoaded) return (
    <main className="mt-10 text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </main>
  );

  if (user) return children;

  return (
    <Navigate to='/login' state={{prevPath: pathname}} />
  )
};

export default PrivateRoutes;

PrivateRoutes.propTypes = {
  children: PropTypes.node
}