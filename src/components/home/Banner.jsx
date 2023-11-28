import { useQuery } from '@tanstack/react-query';
import bannerBg from '../../assets/images/banner-bg.jpg';
import {IoSearch} from 'react-icons/io5';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { Link } from 'react-router-dom';

const Banner = () => {
  const [searchText, setSearchText] = useState('');
  const axiosPublic = useAxiosPublic();

  const {data: searchedPosts = [], refetch} = useQuery({
    queryKey: ["taggedPosts", searchText],
    queryFn: async() => {
      const res = await axiosPublic(`taggedPosts?tag=${searchText}`);
      return res.data;
    }
  })

  const handleOnChange = e => {
    let value = e.target.value;
    value = value.toLowerCase().trim();
    setSearchText(value);
  }

  useEffect(() => {
    refetch();
  }, [searchText, refetch]);

  return (
    <section className='min-h-[230px] sm:min-h-[350px] bg-cover bg-center flex justify-center items-center' style={{backgroundImage: `url('${bannerBg}')`}}>
      <div className="container">
        <h2 className='text-2xl sm:text-4xl font-medium text-white text-center mb-4 sm:mb-6'>Welcome to CircleSync!</h2>
        <div className='w-full max-w-[500px] mx-auto relative'>
          <input className='input w-full pr-12' type="search" name="search" id="search" placeholder='Search by tag' onChange={handleOnChange} />
          <IoSearch className='absolute right-4 top-1/2 -translate-y-1/2 text-2xl' />
          <div className='bg-white w-full max-w-[500px] mx-auto rounded-lg shadow-xl mt-2 absolute max-h-[200px] overflow-auto'>
          <div className='[&>*]:border-b [&>*]:border-gray-300 [&>*:last-child]:border-none'>
            {
              searchedPosts?.map(post => <Link to={`/posts/${post._id}`} className='block px-4 py-3 font-medium' key={post?._id}>
                <span>{post?.title}</span>
              </Link>)
            }
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;