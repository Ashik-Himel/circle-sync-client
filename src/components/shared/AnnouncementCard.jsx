import PropTypes from 'prop-types';

const AnnouncementCard = ({announcement}) => {
  return (
    <div className='border-2 border-gray-300 rounded-lg p-4 bg-gray-100'>
      <h3 className='text-2xl font-medium mb-2'>{announcement.title}</h3>
      <p className='text-gray-500 mb-4'>{announcement.description}</p>
      <span className='block text-right font-semibold text-gray-500'> - Announced by {announcement.author?.name || 'Admin'}</span>
    </div>
  );
};

export default AnnouncementCard;

AnnouncementCard.propTypes = {
  announcement: PropTypes.object
}