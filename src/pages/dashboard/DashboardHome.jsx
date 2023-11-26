import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const StatCard = ({title, value, linkTitle, link}) => {
  return (
    <div className="inline-block [&>span]:block bg-primary text-white px-8 py-4 min-w-[200px] rounded-lg text-center">
      <span className="block mb-1">{title}</span>
      <span className="text-4xl font-bold mb-3">{value}</span>
      <Link to={link} className="bg-white text-primary font-medium px-2 py-1 rounded-md">{linkTitle}</Link>
    </div>
  );
}

const DashboardHome = () => {
  const {user, userRole} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const {data: postsCount = 0} = useQuery({
    queryKey: ['postsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/postsCount?email=${user?.email}`);
      return res.data;
    }
  })
  const {data: commentsCount = 0} = useQuery({
    queryKey: ['commentsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/commentsCount?email=${user?.email}`);
      return res.data;
    }
  })
  const {data: usersCount = 0} = useQuery({
    queryKey: ['usersCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/usersCount`);
      return res.data;
    }
  })

  const Admin = <div className="flex flex-wrap justify-center items-center gap-6">
    <StatCard title="Total Users" value={usersCount?.totalUsers} linkTitle="Manage Users" link="/dashboard/users" />
    <StatCard title="Gold Users" value={usersCount?.goldUsers} linkTitle="Manage Users" link="/dashboard/users" />
    <StatCard title="Reported Comments" value="14" linkTitle="Reported Comments" link="/dashboard/reports" />
  </div>

  const User = <div className="flex flex-wrap justify-center items-center gap-6">
    <StatCard title="Total Posts" value={postsCount} linkTitle="Manage Posts" link="/dashboard/posts" />
    <StatCard title="User Status" value={userRole[0].toUpperCase() + userRole.slice(1)} linkTitle="My Profile" link="/dashboard/profile" />
    <StatCard title="Total Comments" value={commentsCount} linkTitle="Manage Posts" link="/dashboard/posts" />
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
  linkTitle: PropTypes.string,
  link: PropTypes.string,
}