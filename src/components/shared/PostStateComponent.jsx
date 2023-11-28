import {AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import {IoShareSocialSharp} from 'react-icons/io5';
import PropTypes from 'prop-types';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import useUserContext from '../../hooks/useUserContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useEffect } from 'react';

const PostStateComponent = ({upVote, downVote, postId, showShare = true, setShowShareBox, refetchPost, commentState}) => {
  const {user} = useUserContext();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const {data: voteState = {}, refetch} = useQuery({
    queryKey: ['voteState', postId, user?.email],
    queryFn: async() => {
      if (user?.email) {
        const res = await axiosSecure(`/voteState/${postId}`);
        return res.data;
      }
      return {};
    }
  })

  const {data: commentCount = 0, refetch: refetch2} = useQuery({
    queryKey: ['comments', postId, 'count'],
    queryFn: async() => {
      const res = await axiosPublic(`comments/${postId}/count`);
      return res.data;
    }
  })

  const handleReaction = stat => {
    if (!user) {
      Swal.fire({
        title: 'Login',
        text: "You have to login to react on a post!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Login!'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      })
    } else {
      if (stat === 'up') {
        axiosSecure(`/upVote/${postId}`)
          .then(() => {
            refetch();
            refetchPost();
          })
      }
      else if (stat === "down") {
        axiosSecure(`/downVote/${postId}`)
          .then(() => {
            refetch();
            refetchPost();
          })
      }
    }
  }

  useEffect(() => {
    refetch2();
  }, [commentState, refetch2])

  return (
    <div className='flex justify-center items-center gap-4 sm:gap-6 font-medium'>
      <div className='flex justify-center items-center gap-2'>
        <span>{upVote}</span>
        <div className='text-[18px] cursor-pointer select-none' onClick={() => handleReaction('up')}>
        {
          user?.email ? voteState?.status === 'upVote' ? <AiFillLike /> : <AiOutlineLike /> : <AiOutlineLike />
        }
        </div>
      </div>
      <div className='flex justify-center items-center gap-1'>
        <span>{downVote}</span>
        <div className='text-[18px] cursor-pointer select-none' onClick={() => handleReaction('down')}>
          {
            user?.email ? voteState?.status === 'downVote' ? <AiFillDislike /> : <AiOutlineDislike /> : <AiOutlineDislike />
          }
        </div>
      </div>
      <div className='flex justify-center items-center gap-2'>
        <span>{commentCount}</span>
        <label htmlFor="comment">
          <FaRegComment className='text-[18px] cursor-pointer select-none' />
        </label>
      </div>
      {
        showShare ? <IoShareSocialSharp className='text-[18px] cursor-pointer select-none -ml-2' onClick={() => setShowShareBox(true)} /> : null
      }
    </div>
  );
};

export default PostStateComponent;

PostStateComponent.propTypes = {
  upVote: PropTypes.string,
  downVote: PropTypes.string,
  postId: PropTypes.string,
  showShare: PropTypes.bool,
  setShowShareBox: PropTypes.func,
  refetchPost: PropTypes.func,
  commentState: PropTypes.bool
}