import { Helmet } from "react-helmet-async";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../components/shared/LoadingComponent";
import { format } from "date-fns";
import PostStateComponent from "../components/shared/PostStateComponent";
import {FaArrowLeft} from 'react-icons/fa6';
import CommentCard from "../components/shared/CommentCard";
import AddCommentCard from "../components/shared/AddCommentCard";

const PostDetails = () => {
  const {id} = useParams();
  const axiosPublic = useAxiosPublic();
  const {data: post = {}, isLoading} = useQuery({
    queryKey: ['posts', id],
    queryFn: async() => {
      const res = await axiosPublic(`posts/${id}`)
      return res.data;
    }
  })
  const {data: comments = [], refetch} = useQuery({
    queryKey: ['comments', id],
    queryFn: async() => {
      const res = await axiosPublic(`/comments/${id}`);
      return res.data;
    }
  })

  if (isLoading) return (
    <main>
      <LoadingComponent />
    </main>
  );

  return (
    <main>
      <Helmet>
        <title>Post Details - CircleSync</title>
      </Helmet>

      <section className="mt-4">
        <div className="container">
          <div className="max-w-[700px] mx-auto">
            <Link to='/' className="btn btn-primary mb-4">
              <FaArrowLeft />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="border-2 border-gray-300 rounded-lg bg-gray-100 max-w-[700px] mx-auto">
            <div className="p-4 border-b-2 border-gray-300 flex justify-between items-center gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <img className="w-12 h-12 rounded-full" src={post.author.photo} alt="Author's Photo" />
                <div>
                  <h4 className="text-[18px] font-semibold">Author: {post.author.name}</h4>
                  <span className="text-gray-500">{format(new Date(post.publishedTime), 'dd MMM, yyyy p')}</span>
                  <span></span>
                </div>
              </div>
              <PostStateComponent upVote={"" + post.upVote} downVote={"" + post.downVote} postId={post._id} />
            </div>

            <div className="p-4">
              <h3 className="text-2xl font-medium mb-1">{post.title}</h3>
              <span className="block italic text-gray-500 mb-4">Tag: {post.tag}</span>
              <p>{post.description}</p>

              <h2 className="text-3xl font-medium mt-8">Comments</h2>

              <div className="space-y-4 mt-4">
                {
                  comments?.map(comment => <CommentCard key={comment._id} comment={comment} />)
                }
              </div>

              <AddCommentCard postTitle={post.title} postId={post._id} postAuthorEmail={post.author?.email} refetch={refetch} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PostDetails;