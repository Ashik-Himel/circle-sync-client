import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionHeader from "../shared/SectionHeader";

const AllTags = () => {
  const axiosPublic = useAxiosPublic();
  const {data: allTags = [], isLoading} = useQuery({
    queryKey: ['tags'],
    queryFn: async() => {
      const res = await axiosPublic('/tags');
      return res.data;
    }
  })

  return (
    <section className="mt-12">
      <div className="container">
        <SectionHeader heading="All Tags" subHeading="You can search posts with those tags" />

        <div className="flex justify-center items-center gap-2 w-full max-w-[700px] mx-auto">
          {
            !isLoading ? allTags?.map(tag => <span key={tag._id} className="inline-block bg-primary text-white px-4 py-2 rounded-full font-medium">{tag.tag}</span>) : <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        </div>
      </div>
    </section>
  );
};

export default AllTags;