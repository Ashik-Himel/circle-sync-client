import { format } from 'date-fns';
import PropTypes from 'prop-types';
import PostStateComponent from './PostStateComponent';
import { Link } from 'react-router-dom';

const PostCard = ({post}) => {
  return (
    <Link to={`/posts/${post._id}`} className='bg-gray-100 border-2 border-gray-300 rounded-lg'>
      <div className='p-4 border-b-2 border-gray-300 flex items-center gap-4'>
        <div>
          <img className='w-full max-w-[3rem] rounded-full' src={post.author.photo} alt="Author's Photo" />
        </div>
        <div>
          <h4 className='text-[18px] font-semibold'>Author: {post.author.name}</h4>
          <span className='text-gray-500'>{format(new Date(post.publishedTime), 'dd MMM, yyyy p')}</span>
        </div>
      </div>
      
      <div className='p-4'>
        <h3 className='text-2xl font-medium mb-4'>{post.title}</h3>
        
        <div className='flex flex-wrap justify-between items-center gap-4'>
          <span className='text-gray-500'>Tag: {post.tag}</span>
          <PostStateComponent upVote={post.upVote + ""} downVote={post.downVote + ""} postId={post._id} showShare={false} />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;

PostCard.propTypes = {
  post: PropTypes.object
}