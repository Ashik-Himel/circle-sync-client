import { Helmet } from "react-helmet-async";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/shared/LoadingComponent";

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

  if (isLoading) return <LoadingComponent />;

  return (
    <main>
      <Helmet>
        <title>Post Details - CircleSync</title>
      </Helmet>

      <section>
        <div className="container">
          {post.title}
        </div>
      </section>
    </main>
  );
};

export default PostDetails;