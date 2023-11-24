import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionHeader from "../shared/SectionHeader";
import AnnouncementCard from "../shared/AnnouncementCard";

const Announcements = () => {
  const axiosPublic = useAxiosPublic();
  const {data: announcements = [], isLoading} = useQuery({
    queryKey: ['announcements'],
    queryFn: async() => {
      const res = await axiosPublic('/announcements');
      return res.data;
    }
  });

  if (isLoading) return null;
  else if (!announcements.length) return null;

  return (
    <section className="mt-12">
      <div className="container">
        <SectionHeader heading='Announcements' subHeading='Here you will see all the announcements posted by admin' />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {
            announcements?.map(announcement => <AnnouncementCard key={announcement._id} announcement={announcement} />)
          }
        </div>
      </div>
    </section>
  );
};

export default Announcements;