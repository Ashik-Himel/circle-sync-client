import PropTypes from 'prop-types';

const SectionHeader = ({heading, subHeading}) => {
  return (
    <div className='text-center mb-6'>
      <h2 className='text-3xl font-medium mb-1'>{heading}</h2>
      <span className='text-gray-500 max-w-[550px] mx-auto'>{subHeading}</span>
    </div>
  );
};

export default SectionHeader;

SectionHeader.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string
}