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
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import UserRoutes from '../manageRoutes/UserRoutes';
import UserProfile from '../pages/dashboard/UserProfile';
import AdminRoutes from '../manageRoutes/AdminRoutes';
import AdminProfile from '../pages/dashboard/AdminProfile';
import UsersPost from '../pages/dashboard/UsersPost';
import AddPost from '../pages/dashboard/AddPost';
import DashboardUsers from '../pages/dashboard/DashboardUsers';
import ReportedComments from '../pages/dashboard/ReportedComments';
import MakeAnnouncement from '../pages/dashboard/MakeAnnouncement';

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
  },
  {
    path: '/dashboard',
    element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard/stat',
        element: <PrivateRoutes><DashboardHome /></PrivateRoutes>
      },
      {
        path: '/dashboard/profile',
        element: <UserRoutes><UserProfile /></UserRoutes>
      },
      {
        path: '/dashboard/posts',
        element: <UserRoutes><UsersPost /></UserRoutes>
      },
      {
        path: '/dashboard/add-post',
        element: <UserRoutes><AddPost /></UserRoutes>
      },
      {
        path: '/dashboard/admin-profile',
        element: <AdminRoutes><AdminProfile /></AdminRoutes>
      },
      {
        path: '/dashboard/users',
        element: <AdminRoutes><DashboardUsers /></AdminRoutes>
      },
      {
        path: '/dashboard/reports',
        element: <AdminRoutes><ReportedComments /></AdminRoutes>
      },
      {
        path: '/dashboard/announcement/add',
        element: <AdminRoutes><MakeAnnouncement /></AdminRoutes>
      }
    ]
  }
]);