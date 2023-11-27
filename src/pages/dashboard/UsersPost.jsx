import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserContext from "../../hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {MdDelete} from 'react-icons/md';
import Swal from "sweetalert2";

const UsersPost = () => {
  const {user} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const {data : posts = [], refetch} = useQuery({
    queryKey: ['posts', user?.email],
    queryFn: async() => {
      const res = await axiosSecure(`/posts/user/${user?.email}`);
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
      </section>
    </div>
  );
};

export default UsersPost;