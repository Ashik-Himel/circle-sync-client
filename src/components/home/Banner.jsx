import bannerBg from '../../assets/images/banner-bg.jpg';
import {IoSearch} from 'react-icons/io5';

const Banner = () => {
  return (
    <section className='min-h-[230px] sm:min-h-[350px] bg-cover bg-center flex justify-center items-center' style={{backgroundImage: `url('${bannerBg}')`}}>
      <div className="container">
        <h2 className='text-2xl sm:text-4xl font-medium text-white text-center mb-4 sm:mb-6'>Welcome to CircleSync!</h2>
        <div className='w-full max-w-[500px] mx-auto relative'>
          <input className='input w-full pr-12' type="search" name="search" id="search" placeholder='Search by tag' />
          <IoSearch className='absolute right-4 top-1/2 -translate-y-1/2 text-2xl' />
        </div>
      </div>
    </section>
  );
};

export default Banner;