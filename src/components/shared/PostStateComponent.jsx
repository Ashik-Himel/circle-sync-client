import {AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import PropTypes from 'prop-types';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const PostStateComponent = ({upVote, downVote, postId}) => {
  const axiosPublic = useAxiosPublic();
  const {data: commentCount = 0} = useQuery({
    queryKey: ['comments', postId, 'count'],
    queryFn: async() => {
      const res = await axiosPublic(`comments/${postId}/count`);
      return res.data;
    }
  })

  return (
    <div className='flex flex-wrap justify-center items-center gap-6 font-medium'>
      <div className='flex justify-center items-center gap-2'>
        <span>{upVote}</span>
        <AiOutlineLike className='text-[18px] cursor-pointer select-none' />
      </div>
      <div className='flex justify-center items-center gap-2'>
        <span>{downVote}</span>
        <AiOutlineDislike className='text-[18px] cursor-pointer select-none' />
      </div>
      <div className='flex justify-center items-center gap-2'>
        <span>{commentCount}</span>
        <FaRegComment className='text-[18px] cursor-pointer select-none' />
      </div>
    </div>
  );
};

export default PostStateComponent;

PostStateComponent.propTypes = {
  upVote: PropTypes.number,
  downVote: PropTypes.number,
  postId: PropTypes.string
}