import { Link, useLocation } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";
import LoadingComponent from "./LoadingComponent";
import PropTypes from 'prop-types';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddCommentCard = ({postTitle, postId, postAuthorEmail, refetch}) => {
  const {user, userLoaded} = useUserContext();
  const {pathname} = useLocation();
  const axiosSecure = useAxiosSecure();

  const handleSubmit = e => {
    e.preventDefault();

    const time = new Date().toISOString();
    const comment = e.target.comment.value;
    const author = {
      name: user?.displayName,
      email: user?.email,
      photo: user?.photoURL,
    };
    const data = {postTitle, postId, postAuthorEmail, comment, time, author}

    axiosSecure.post('/comments', data)
      .then((res) => {
        if (res.data?.insertedId) {
          refetch();
          e.target.reset();
        }
      })
      .catch(err => {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error"
        });
      })
  };

  if (!userLoaded) return <LoadingComponent />
  else if (!user) return (
    <div className="text-center py-8">
      <span className="block mb-2 text-xl font-medium">Login to add comment.</span>
      <Link className="btn btn-primary" to='/login' state={{prevPath: pathname}}>Login</Link>
    </div>
  );

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <textarea className="textarea w-full resize-none border-2 border-gray-300" name="comment" id="comment" placeholder="Write a comment" required></textarea>
      <button className="btn btn-primary mt-2" type="submit">Comment</button>
    </form>
  );
};

export default AddCommentCard;

AddCommentCard.propTypes = {
  postTitle: PropTypes.string,
  postId: PropTypes.string,
  postAuthorEmail: PropTypes.string,
  refetch: PropTypes.func
}