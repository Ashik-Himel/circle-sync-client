import { Link, NavLink } from 'react-router-dom';
import { FaBell, FaBars } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import useUserContext from '../hooks/useUserContext';
import { useState } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const Header = () => {
  const {user, userLoaded} = useUserContext();
  const [drawerShow, setDrawerShow] = useState(false);
  const axiosPublic = useAxiosPublic();
  const {data: announcementCount = 0} = useQuery({
    queryKey: ['announcements', 'count'],
    queryFn: async() => {
      const res = await axiosPublic('/announcements/count');
      return res.data;
    }
  })

  return (
    <header className='py-4 border-b-2 border-gray-300 fixed left-0 right-0 top-0 bg-white z-50'>
      <div className="container">
        <nav className='flex justify-between items-center gap-4'>
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
                <NavLink to='/membership' className={({isActive}) => isActive ? 'font-bold text-primary' : ''} onClick={() => setDrawerShow(false)}>Membership</NavLink>
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
                userLoaded ? user ? <div>
                  <img className='w-10 h-10 rounded-full border-2 border-primary' src={user?.photoURL} alt="User's Photo" />
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