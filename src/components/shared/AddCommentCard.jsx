import { Link, useLocation } from "react-router-dom";
import useUserContext from "../../hooks/useUserContext";
import LoadingComponent from "./LoadingComponent";
import PropTypes from 'prop-types';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const AddCommentCard = ({postTitle, postId, postAuthorEmail, refetch, commentState, setCommentState}) => {
  const {user, userLoaded} = useUserContext();
  const {pathname} = useLocation();
  const axiosSecure = useAxiosSecure();
  const {register, handleSubmit, reset} = useForm();

  const onSubmit = data => {
    const time = new Date().toISOString();
    const comment = data.comment;
    const author = {
      name: user?.displayName,
      email: user?.email,
      photo: user?.photoURL,
    };
    const commentObj = {postTitle, postId, postAuthorEmail, comment, time, author}

    axiosSecure.post('/comments', commentObj)
      .then((res) => {
        if (res.data?.insertedId) {
          refetch();
          setCommentState(!commentState);
          reset();
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
    <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
      <textarea className="textarea w-full resize-none border-2 border-gray-300 mb-2" {...register("comment")} id="comment" placeholder="Write a comment" required></textarea>
      <AwesomeButton type="primary">Comment</AwesomeButton>
    </form>
  );
};

export default AddCommentCard;

AddCommentCard.propTypes = {
  postTitle: PropTypes.string,
  postId: PropTypes.string,
  postAuthorEmail: PropTypes.string,
  refetch: PropTypes.func,
  commentState: PropTypes.bool,
  setCommentState: PropTypes.func
}