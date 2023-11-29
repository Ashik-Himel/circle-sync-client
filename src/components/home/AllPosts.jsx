import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionHeader from "../shared/SectionHeader";
import PostCard from "../shared/PostCard";
import LoadingComponent from "../shared/LoadingComponent";
import { useEffect, useState } from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const AllPosts = () => {
  const [page, setPage] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);

  const axiosPublic = useAxiosPublic();
  const {
    data: posts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosPublic(
        `/posts?popularity=${sortByPopularity}&skip=${page - 1}`
      );
      return res.data;
    },
  });
  const { data: totalPostsCount, isLoading: isLoading2 } = useQuery({
    queryKey: ["totalPostsCount"],
    queryFn: async () => {
      const res = await axiosPublic(`/totalPostsCount`);
      return res.data;
    },
  });

  let pageTrack = [];
  if (!isLoading2) {
    for (let i = 1; i <= Math.ceil(totalPostsCount / 5); i++) {
      pageTrack.push(i);
    }
  }

  useEffect(() => {
    refetch();
  }, [sortByPopularity, page, refetch]);

  useEffect(() => {
    setPage(1);
  }, [sortByPopularity]);

  return (
    <section className="mt-12">
      <div className="container">
        <SectionHeader
          heading="All Posts"
          subHeading="Here you will see all posts created by users"
        />

        <div className="text-right mb-4">
          <div className="inline-block" onClick={() => setSortByPopularity(!sortByPopularity)}>
            <AwesomeButton
              type="primary"
            >
              {sortByPopularity ? "Sort by Default" : "Sort by Popularity"}
            </AwesomeButton>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {!isLoading ? (
            posts?.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <LoadingComponent />
          )}
        </div>
        <div className="mt-8">
          <div className="container">
            <nav>
              <ul className="flex flex-wrap justify-center items-center -space-x-px text-sm">
                <li>
                  <button
                    className="flex items-center justify-center px-3 h-8 ml-0 leading-tight bg-white border border-gray-500 rounded-l-lg hover:bg-primary hover:text-white disabled:!bg-gray-300 disabled:!text-black disabled:cursor-not-allowed"
                    disabled={page === 1 ? "disabled" : ""}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>
                </li>
                {pageTrack?.map((pageNum) => (
                  <li key={pageNum}>
                    <button
                      className="flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-500 hover:bg-primary hover:text-white"
                      style={
                        pageNum === page
                          ? { backgroundColor: "#38A1E3", color: "white" }
                          : {}
                      }
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-500 rounded-r-lg hover:bg-primary hover:text-white disabled:!bg-gray-300 disabled:!text-black disabled:cursor-not-allowed"
                    disabled={page === pageTrack?.length ? "disabled" : ""}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllPosts;
