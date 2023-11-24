import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionHeader from "../shared/SectionHeader";
import PostCard from "../shared/PostCard";
import LoadingComponent from "../shared/LoadingComponent";
import { useEffect, useState } from "react";

const AllPosts = () => {
  const [sortByPopularity, setSortByPopularity] = useState(false);

  const axiosPublic = useAxiosPublic();
  const {data: posts = [], isLoading, refetch} = useQuery({
    queryKey: ['posts'],
    queryFn: async() => {
      const res = await axiosPublic(`/posts?popularity=${sortByPopularity}`);
      return res.data;
    }
  })

  useEffect(() => {
    refetch();
  }, [sortByPopularity, refetch])

  return (
    <section className="mt-12">
      <div className="container">
        <SectionHeader heading="All Posts" subHeading="Here you will see all posts created by users" />

        <div className="text-right mb-4">
          <button className="btn btn-primary" onClick={() => setSortByPopularity(!sortByPopularity)}>
            {
              sortByPopularity ? "Sort by Default" : "Sort by Popularity"
            }
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {
            !isLoading ? posts?.map(post => <PostCard key={post._id} post={post} />) : <LoadingComponent />
          }
        </div>
      </div>
    </section>
  );
};

export default AllPosts;