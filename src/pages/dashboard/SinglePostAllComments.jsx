import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import {IoArrowBack} from 'react-icons/io5';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

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
  const [page, setPage] = useState(1);
  const {id: postId} = useParams();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const {data: post = ""} = useQuery({
    queryKey: ["posts", postId],
    queryFn: async() => {
      const res = await axiosPublic(`/posts/${postId}`);
      return res.data;
    }
  })
  const {data: comments = [], refetch} = useQuery({
    queryKey: ['comments', postId],
    queryFn: async() => {
      const res = await axiosPublic(`/comments/${postId}?skip=${page-1}`);
      return res.data;
    }
  })
  const {data: postCommentsCount, isLoading: isLoading2} = useQuery({
    queryKey: ['postCommentsCount', postId],
    queryFn: async() => {
      const res = await axiosSecure(`/postCommentsCount/${postId}`);
      return res.data;
    }
  })

  let pageTrack = [];
  if (!isLoading2) {
    for (let i = 1; i <= Math.ceil(postCommentsCount / 10); i++) {
      pageTrack.push(i);
    }
  }

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <div>
      <Helmet>
        <title>Post&apos;s Comments - CircleSync</title>
      </Helmet>

      <section>
        <Link to="/dashboard/posts" className="block mb-4">
          <AwesomeButton type="primary">
            <IoArrowBack />
            <span className="ml-2">All Posts</span>
          </AwesomeButton>
        </Link>
        <h2 className="text-2xl font-medium text-center mb-4 text-primary">{post?.title} :: Comments</h2>

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

        <div className="max-w-[900px] mx-auto">
          <div>
            <nav className="flex justify-between items-center gap-4 py-3 flex-wrap">
              <div>
                <span>Showing {Math.min(((page-1) * 10)+1, postCommentsCount)}-{Math.min(page*10, postCommentsCount)} of {postCommentsCount}</span>
              </div>
              <ul className="flex flex-wrap justify-center items-center -space-x-px text-sm">
                <li>
                  <button className="flex items-center justify-center px-3 h-8 ml-0 leading-tight bg-white border border-gray-500 rounded-l-lg hover:bg-primary hover:text-white disabled:!bg-gray-300 disabled:!text-black disabled:cursor-not-allowed" disabled={page === 1 ? "disabled" : ""} onClick={() => setPage(page-1)}>Prev</button>
                </li>
                {
                  pageTrack?.map(pageNum => <li key={pageNum}>
                    <button className="flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-500 hover:bg-primary hover:text-white" style={pageNum === page ? {backgroundColor: "#38A1E3", color: "white"} : {}} onClick={() => setPage(pageNum)}>{pageNum}</button>
                  </li>)
                }
                <li>
                  <button className="flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-500 rounded-r-lg hover:bg-primary hover:text-white disabled:!bg-gray-300 disabled:!text-black disabled:cursor-not-allowed" disabled={page === pageTrack?.length ? "disabled" : ""} onClick={() => setPage(page+1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
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