import { Link, NavLink } from 'react-router-dom';
import { FaBell, FaBars } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import useUserContext from '../hooks/useUserContext';
import { useState } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';

const Header = () => {
  const {user, userLoaded} = useUserContext();
  const [drawerShow, setDrawerShow] = useState(false);
  const [profileShow, setProfileShow] = useState();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const {data: announcementCount = 0} = useQuery({
    queryKey: ['announcementsCount'],
    queryFn: async() => {
      const res = await axiosPublic('/announcementsCount');
      return res.data;
    }
  })

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        axiosSecure('/logout', {withCredentials: true})
          .then((res) => {
            if (res.data) {
              toast.success('Logout Successful !!!');
            }
          })
      })
      .catch(error => {
        toast.error(error.code);
      })
  }

  return (
    <header className='py-4 border-b-2 border-gray-300 fixed left-0 right-0 top-0 bg-white z-50'>
      <div className="container">
        <nav className='relative flex justify-between items-center gap-4'>
          <Link to='/' className='flex justify-center items-center gap-2'>
            <img className='w-6 sm:w-8' src="/favicon.png" alt="Brand Icon" />
            <span className='text-2xl sm:text-3xl font-medium'>Circle<span className='text-primary'>Sync</span></span>
          </Link>

          <ul className='flex justify-center items-center gap-4 sm:gap-6'>
            <div className='flex flex-col md:flex-row justify-center items-center gap-6 fixed md:static top-0 bottom-0 text-xl md:text-base w-4/5 max-w-[280px] md:w-auto md:max-w-none bg-white border-s-2 border-primary md:bg-none md:border-none z-40 transition-[right] duration-300 md:transition-none' style={drawerShow ? {right: '0px'} : {right: '-300px'}}>
              <FaCircleXmark className='text-3xl cursor-pointer select-none absolute left-6 top-6 md:hidden' onClick={() => setDrawerShow(false)} />
              <li>
                <NavLink to='/' className={({isActive}) => isActive ? 'font-medium text-primary' : ''} onClick={() => setDrawerShow(false)}>Home</NavLink>
              </li>
              <li>
                <NavLink to='/membership' className={({isActive}) => isActive ? 'font-medium text-primary' : ''} onClick={() => setDrawerShow(false)}>Membership</NavLink>
              </li>
              <li>
                <div className='relative mt-3 md:mt-0 md:mr-3'>
                  <FaBell className='text-2xl' />
                  <span className="badge badge-primary text-white font-bold absolute bottom-[calc(100%-10px)] left-[calc(100%-15px)] text-sm">{announcementCount}</span>
                </div>
              </li>
            </div>
            <li>
              {
                userLoaded ? user ? <div className="flex justify-center items-center gap-2">
                  <div className="relative group peer cursor-pointer">
                    <img className="w-10 h-10 rounded-full select-none" onClick={() => setProfileShow(!profileShow)} src={user?.photoURL} alt="User's Photo" />
                    <span className="w-7 h-7 bg-white rotate-45 absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10" style={profileShow ? {display: "block"} : {display: "none"}}></span>
                  </div>
                  <div className="flex-col justify-center items-center bg-white p-6 rounded-lg absolute top-[calc(100%+1rem)] right-0 w-full max-w-[320px] [box-shadow:0px_10px_40px_5px_rgba(0,0,0,0.3)]" style={profileShow ? {display: "flex"} : {display: "none"}}>
                    <img className="w-20 h-20 rounded-full mb-4 z-20" src={user?.photoURL} alt="User's Photo" />
                    <span className="text-[18px] font-medium mb-1 text-center">{user?.displayName}</span>
                    <div className='flex justify-center items-center gap-2 mt-4'>
                      <Link to='/dashboard/stat' className='btn btn-primary' onClick={() => setProfileShow(false)}>Dashboard</Link>
                      <button className="btn btn-error text-white" onClick={() => {handleLogout(), setProfileShow(false)}}>Logout</button>
                    </div>
                  </div>
                </div> : <Link className='btn btn-primary text-sm sm:text-base' to='/login'>Join Us</Link> : <div>
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              }
            </li>
            <FaBars className='md:hidden text-3xl cursor-pointer select-none' onClick={() => setDrawerShow(true)} />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;