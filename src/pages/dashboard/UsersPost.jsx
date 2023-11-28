import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserContext from "../../hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {MdDelete} from 'react-icons/md';
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const UsersPost = () => {
  const [page, setPage] = useState(1);
  const {user} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const {data : posts = [], refetch} = useQuery({
    queryKey: ['posts', user?.email],
    queryFn: async() => {
      const res = await axiosSecure(`/posts/user/${user?.email}?skip=${page-1}`);
      return res.data;
    }
  })
  const {data: userPostsCount, isLoading: isLoading2} = useQuery({
    queryKey: ['postsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/postsCount?email=${user?.email}`);
      return res.data;
    }
  })

  const handleDelete = id => {
    Swal.fire({
      title: "Delete Post?",
      text: "Are you sure to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/posts/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your post is deleted successfully.",
                icon: "success"
              });
              refetch();
            }
          })
      }
    });
  }

  let pageTrack = [];
  if (!isLoading2) {
    for (let i = 1; i <= Math.ceil(userPostsCount / 10); i++) {
      pageTrack.push(i);
    }
  }

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <div>
      <Helmet>
        <title>My Posts - CircleSync</title>
      </Helmet>

      <section>
        <h2 className="text-3xl font-medium text-center mb-4 text-primary">My Posts</h2>

        <div className="overflow-x-auto">
          <table className="border border-black [&_th]:border [&_th]:border-black [&_td]:border [&_td]:border-black [&_th]:px-4 [&_th]:py-2 [&_th]:bg-primary [&_th]:text-white [&_td]:px-4 [&_td]:py-2 min-w-[650px] w-full max-w-[900px] mx-auto text-center">
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Up Vote</th>
                <th>Down Vote</th>
                <th>Comments</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                posts?.map(post => <tr key={post._id}>
                  <td>{post?.title}</td>
                  <td>{post?.upVote}</td>
                  <td>{post?.downVote}</td>
                  <td>
                    <Link to={`/dashboard/posts/${post._id}/comments`} className="btn btn-primary min-h-[32px]">View</Link>
                  </td>
                  <td>
                    <MdDelete className="text-red-500 text-2xl mx-auto cursor-pointer select-none" onClick={() => handleDelete(post._id)} />
                  </td>
                </tr>)
              }
            </tbody>
          </table>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div>
            <nav className="flex justify-between items-center gap-4 py-3 flex-wrap">
              <div>
                <span>Showing {Math.min(((page-1) * 10)+1, userPostsCount)}-{Math.min(page*10, userPostsCount)} of {userPostsCount}</span>
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

export default UsersPost;