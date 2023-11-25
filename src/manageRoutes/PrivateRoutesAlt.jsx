import PropTypes from 'prop-types';
import useUserContext from '../hooks/useUserContext';
import { Navigate } from 'react-router-dom';

const PrivateRoutesAlt = ({children}) => {
  const {user, userLoaded} = useUserContext();

  if (!userLoaded) return (
    <main className="mt-10 text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </main>
  );

  if (user) return (
    <Navigate to='/' />
  );

  return children;
};

export default PrivateRoutesAlt;

PrivateRoutesAlt.propTypes = {
  children: PropTypes.node
}