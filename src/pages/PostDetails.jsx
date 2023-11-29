import { Helmet } from "react-helmet-async";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../components/shared/LoadingComponent";
import { format } from "date-fns";
import PostStateComponent from "../components/shared/PostStateComponent";
import {FaArrowLeft, FaCircleXmark} from 'react-icons/fa6';
import CommentCard from "../components/shared/CommentCard";
import AddCommentCard from "../components/shared/AddCommentCard";
import { useState } from "react";
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const PostDetails = () => {
  const [showShareBox, setShowShareBox] = useState(false);
  const [commentState, setCommentState] = useState(true);
  const {id} = useParams();
  const axiosPublic = useAxiosPublic();

  const {data: post = {}, isLoading, refetch: refetchPost} = useQuery({
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
          <div className="max-w-[700px] mx-auto mb-4">
            <Link to='/'>
              <AwesomeButton type="primary">
                <FaArrowLeft />
                <span className="ml-2">Back to Home</span>
              </AwesomeButton>
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
              <PostStateComponent upVote={"" + post.upVote} downVote={"" + post.downVote} postId={post._id} setShowShareBox={setShowShareBox} refetchPost={refetchPost} commentState={commentState} />
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

              <AddCommentCard postTitle={post.title} postId={post._id} postAuthorEmail={post.author?.email} refetch={refetch} commentState={commentState} setCommentState={setCommentState} />
            </div>
          </div>

          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 p-6 justify-center items-center" style={showShareBox ? {display: 'flex'} : {display: "none"}}>
            <div className="w-full max-w-[500px] bg-white rounded-lg px-6 py-10">
              <div className="flex justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-medium text-primary">Share Post</h2>
                <FaCircleXmark className="text-3xl select-none cursor-pointer" onClick={() => setShowShareBox(false)} />
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <FacebookShareButton url={`https://circle-sync-1.web.app/posts/${id}`} onClick={() => setShowShareBox(false)}>
                  <FacebookIcon size={40} round="true" />
                </FacebookShareButton>
                <WhatsappShareButton url={`https://circle-sync-1.web.app/posts/${id}`} onClick={() => setShowShareBox(false)}>
                  <WhatsappIcon size={40} round="true" />
                </WhatsappShareButton>
                <TwitterShareButton url={`https://circle-sync-1.web.app/posts/${id}`} onClick={() => setShowShareBox(false)}>
                  <TwitterIcon size={40} round="true" />
                </TwitterShareButton>
                <LinkedinShareButton url={`https://circle-sync-1.web.app/posts/${id}`} onClick={() => setShowShareBox(false)}>
                  <LinkedinIcon size={40} round="true" />
                </LinkedinShareButton>
                <TelegramShareButton url={`https://circle-sync-1.web.app/posts/${id}`} onClick={() => setShowShareBox(false)}>
                  <TelegramIcon size={40} round="true" />
                </TelegramShareButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PostDetails;