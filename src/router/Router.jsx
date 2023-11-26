import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import ErrorPage from '../pages/ErrorPage';
import Home from '../pages/Home';
import Membership from '../pages/Membership';
import PrivateRoutesAlt from '../manageRoutes/PrivateRoutesAlt';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PostDetails from '../pages/PostDetails';
import PrivateRoutes from '../manageRoutes/PrivateRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/posts/:id',
        element: <PostDetails />
      },
      {
        path: '/membership',
        element: <PrivateRoutes><Membership /></PrivateRoutes>
      },
      {
        path: '/login',
        element: <PrivateRoutesAlt><Login /></PrivateRoutesAlt>
      },
      {
        path: '/register',
        element: <PrivateRoutesAlt><Register /></PrivateRoutesAlt>
      }
    ]
  }
]);