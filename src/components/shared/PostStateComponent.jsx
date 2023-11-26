import {AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import {IoShareSocialSharp} from 'react-icons/io5';
import PropTypes from 'prop-types';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const PostStateComponent = ({upVote, downVote, postId, showShare = true}) => {
  const axiosPublic = useAxiosPublic();
  const {data: commentCount = 0} = useQuery({
    queryKey: ['comments', postId, 'count'],
    queryFn: async() => {
      const res = await axiosPublic(`comments/${postId}/count`);
      return res.data;
    }
  })

  return (
    <div className='flex justify-center items-center gap-4 sm:gap-6 font-medium'>
      <div className='flex justify-center items-center gap-2'>
        <span>{upVote}</span>
        <AiOutlineLike className='text-[18px] cursor-pointer select-none' />
      </div>
      <div className='flex justify-center items-center gap-1'>
        <span>{downVote}</span>
        <AiOutlineDislike className='text-[18px] cursor-pointer select-none' />
      </div>
      <div className='flex justify-center items-center gap-2'>
        <span>{commentCount}</span>
        <FaRegComment className='text-[18px] cursor-pointer select-none' />
      </div>
      {
        showShare ? <IoShareSocialSharp className='text-[18px] cursor-pointer select-none -ml-2' /> : null
      }
    </div>
  );
};

export default PostStateComponent;

PostStateComponent.propTypes = {
  upVote: PropTypes.string,
  downVote: PropTypes.string,
  postId: PropTypes.string,
  showShare: PropTypes.bool
}