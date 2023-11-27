import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import {IoArrowBack} from 'react-icons/io5';
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';

const CommentRow = ({comment, refetch}) => {
  const [feedback, setFeedback] = useState('Select');
  const axiosSecure = useAxiosSecure();

  const handleReport = id => {
    Swal.fire({
      title: "Report Comment?",
      text: "Are you sure to report this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Report!"
    }).then((result) => {
      if (result.isConfirmed) {
        const reportObj = {
          reportStatus: 'Reported',
          feedback: feedback
        }
        axiosSecure.put(`/comments/${id}`, reportObj)
          .then(res => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                title: "Reported!",
                text: "Report successful against this comment.",
                icon: "success"
              });
              refetch();
            } else {
              Swal.fire({
                title: "Reported 222!",
                text: "Report successful against this comment.",
                icon: "success"
              });
            }
          })
        .catch(error => toast.error(error.message));
      }
    });
  }
  const handleCommentView = comment => {
    Swal.fire({
      text: comment,
      confirmButtonText: "Close"
    })
  }

  return (
    <tr key={comment._id}>
      <td>{comment?.author?.email}</td>
      <td>
        {
          comment?.comment.length > 20 ? <div>
            {comment?.comment.slice(0, 20)}... <button className="text-primary font-semibold" onClick={() => handleCommentView(comment?.comment)}>Read More</button>
          </div> : comment?.comment
        }
        </td>
      <td>
        <select name="feedback" id="feedback" className="border-2 border-gray-300 p-1 rounded-lg cursor-pointer" onChange={e => setFeedback(e.target.value)} defaultValue={comment?.feedback || feedback} disabled={comment?.reportStatus ? "disabled" : ""}>
          <option value="Select">Select</option>
          <option value="Hate Speech">Hate Speech</option>
          <option value="Spam">Spam</option>
          <option value="Terrorism">Terrorism</option>
        </select>
      </td>
      <td>
        <button className="btn btn-primary min-h-[32px]" disabled={feedback === 'Select' || comment?.reportStatus ? 'disabled' : ''} onClick={() => handleReport(comment._id)}>{comment?.reportStatus || "Report"}</button>
      </td>
    </tr>
  );
}

const SinglePostAllComments = () => {
  const {id: postId} = useParams();
  const axiosPublic = useAxiosPublic();
  const {data: comments = [], refetch} = useQuery({
    queryKey: ['comments', postId],
    queryFn: async() => {
      const res = await axiosPublic(`/comments/${postId}`);
      return res.data;
    }
  })

  return (
    <div>
      <Helmet>
        <title>Post&apos;s Comments - CircleSync</title>
      </Helmet>

      <section>
        <Link to="/dashboard/posts" className="btn btn-primary mb-4">
          <IoArrowBack /> All Posts
        </Link>
        <h2 className="text-3xl font-medium text-center mb-4 text-primary">{comments[0]?.postTitle} (Comments)</h2>

        <div className="overflow-x-auto">
          <table className="border border-black [&_th]:border [&_th]:border-black [&_td]:border [&_td]:border-black [&_th]:px-4 [&_th]:py-2 [&_th]:bg-primary [&_th]:text-white [&_td]:px-4 [&_td]:py-2 min-w-[650px] w-full max-w-[900px] mx-auto text-center">
            <thead>
              <tr>
                <th>User</th>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                comments?.map(comment => <CommentRow key={comment._id} comment={comment} refetch={refetch} />)
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SinglePostAllComments;

CommentRow.propTypes = {
  comment: PropTypes.object,
  refetch: PropTypes.func
}