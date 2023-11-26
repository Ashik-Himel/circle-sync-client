import { NavLink } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";
import PropTypes from 'prop-types';
import {FaCircleXmark} from 'react-icons/fa6';
import {GiHamburgerMenu} from 'react-icons/gi';

const SidebarLink = ({title, link, setSidebarShow}) => {
  return (
    <NavLink to={link} className={({isActive}) => isActive ? 'bg-white text-primary text-center font-medium py-2 rounded-lg' : 'text-center font-medium py-2 rounded-lg'} onClick={() => setSidebarShow(false)}>{title}</NavLink>
  );
}

const DashboardSidebar = ({sidebarShow, setSidebarShow}) => {
  const {userRole} = useUserContext();

  const Admin = <nav className="[&>*]:block space-y-1">
    <SidebarLink title="Dashboard" link="/dashboard/stat" setSidebarShow={setSidebarShow} />
    <SidebarLink title="Admin Profile" link="/dashboard/admin-profile" setSidebarShow={setSidebarShow} />
    <SidebarLink title="Manage Users" link="/dashboard/users" setSidebarShow={setSidebarShow} />
    <SidebarLink title="Reported Comments" link="/dashboard/reports" setSidebarShow={setSidebarShow} />
    <SidebarLink title="Make Announcements" link="/dashboard/announcement/add" setSidebarShow={setSidebarShow} />
  </nav>

  const User = <nav className="[&>*]:block space-y-1">
    <SidebarLink title="Dashboard" link="/dashboard/stat" setSidebarShow={setSidebarShow} />
    <SidebarLink title="My Profile" link="/dashboard/profile" setSidebarShow={setSidebarShow} />
    <SidebarLink title="My Posts" link="/dashboard/posts" setSidebarShow={setSidebarShow} />
    <SidebarLink title="Add Post" link="/dashboard/add-post" setSidebarShow={setSidebarShow} />
  </nav>

  return (
    <aside className="absolute md:static top-0 bottom-0 w-[250px] md:w-auto z-20 transition-[left] duration-300" style={sidebarShow ? {left: "0px"} : {left: "-300px"}}>
      <div className="md:hidden fixed top-[100px] -left-[10px] border border-gray-400 bg-white text-primary p-4 text-2xl rounded-e-full shadow-2xl shadow-gray-900 cursor-pointer select-none" onClick={() => setSidebarShow(true)}>
        <GiHamburgerMenu  />
      </div>
      <div className="bg-primary text-white h-[calc(100vh-89px)] m-2 rounded-lg p-4 shadow-2xl shadow-gray-900 md:shadow-none relative">
        <FaCircleXmark className="text-2xl absolute top-4 right-4 md:hidden select-none cursor-pointer" onClick={() => setSidebarShow(false)} />
        <h2 className="text-2xl font-medium text-center mb-6 mt-12">Dashboard</h2>
        {userRole === "admin" ? Admin : User}
      </div>
    </aside>
  );
};

export default DashboardSidebar;

DashboardSidebar.propTypes = {
  sidebarShow: PropTypes.bool,
  setSidebarShow: PropTypes.func
}
SidebarLink.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  setSidebarShow: PropTypes.func
}