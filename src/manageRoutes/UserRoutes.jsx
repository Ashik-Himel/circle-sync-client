import PropTypes from 'prop-types';
import useUserContext from '../hooks/useUserContext';
import { Navigate } from 'react-router-dom';

const UserRoutes = ({children}) => {
  const {user, userRole, userLoaded} = useUserContext();

  if (!userLoaded) return (
    <main className="mt-10 text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </main>
  );

  if (user && userRole !== "admin") return children;

  return (
    <Navigate to='/' />
  )
};

export default UserRoutes;

UserRoutes.propTypes = {
  children: PropTypes.node
}