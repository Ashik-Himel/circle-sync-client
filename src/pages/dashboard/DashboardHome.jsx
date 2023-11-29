import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const StatCard = ({title, value}) => {
  return (
    <div className="inline-block [&>span]:block bg-primary text-white px-8 py-4 min-w-[200px] rounded-lg text-center">
      <span className="block mb-2">{title}</span>
      <span className="text-4xl font-bold">{value}</span>
    </div>
  );
}

const DashboardHome = () => {
  const {user, userRole} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const {data: totalPostsCount = "0"} = useQuery({
    queryKey: ['totalPostsCount'],
    queryFn: async() => {
      const res = await axiosPublic(`/totalPostsCount`);
      return res.data;
    }
  })
  const {data: postsCount = "0"} = useQuery({
    queryKey: ['postsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/postsCount?email=${user?.email}`);
      return res.data;
    }
  })
  const {data: commentsCount = "0"} = useQuery({
    queryKey: ['commentsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/commentsCount?email=${user?.email}`);
      return res.data;
    }
  })
  const {data: totalCommentsCount = {}} = useQuery({
    queryKey: ['totalCommentsCount'],
    queryFn: async() => {
      if (userRole === 'admin') {
        const res = await axiosSecure(`/totalCommentsCount`);
        return res.data;
      }
      return null;
    }
  })
  const {data: usersCount = {}} = useQuery({
    queryKey: ['usersCount'],
    queryFn: async() => {
      if (userRole === 'admin') {
        const res = await axiosSecure(`/usersCount`);
        return res.data;
      }
      return null;
    }
  })

  const Admin = <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-6">
    <StatCard title="Total Users" value={usersCount?.totalUsers || "0"} />
    <StatCard title="Gold Users" value={usersCount?.goldUsers || "0"} />
    <StatCard title="Total Posts" value={"" + totalPostsCount} />
    <StatCard title="Total Comments" value={totalCommentsCount?.totalComments} />
    <StatCard title="Reported Comments" value={totalCommentsCount?.totalReportedComments} />
  </div>

  const User = <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6">
    <StatCard title="Total Posts" value={"" + postsCount} />
    <StatCard title="User Status" value={userRole && userRole[0]?.toUpperCase() + userRole?.slice(1)} />
    <StatCard title="Total Comments" value={"" + commentsCount} />
  </div>

  return (
    <div>
      <Helmet>
        <title>Dashboard - CircleSync</title>
      </Helmet>

      {userRole === 'admin' ? Admin : User}
    </div>
  );
};

export default DashboardHome;

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
}