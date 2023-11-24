import PropTypes from 'prop-types';

const CommentCard = ({comment}) => {
  return (
    <div className='flex items-start gap-4 bg-gray-200 p-4 rounded-lg'>
      <img className='w-12 h-12 rounded-full' src={comment.author.photo} alt="Comment Author's Photo" />
      <div>
        <h4 className='text-[18px] font-medium'>{comment.author.name}</h4>
        <p className='text-gray-500'>{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentCard;

CommentCard.propTypes = {
  comment: PropTypes.object
}