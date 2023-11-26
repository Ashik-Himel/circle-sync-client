import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const StatCard = ({title, value}) => {
  return (
    <div className="inline-block [&>span]:block bg-primary text-white px-8 py-4 min-w-[200px] rounded-lg text-center">
      <span className="block mb-2">{title}</span>
      <span className="text-4xl font-bold">{value}</span>
    </div>
  );
}

const AdminProfile = () => {
  const {user} = useUserContext();
  const axiosSecure = useAxiosSecure();

  const {data: usersCount = "0"} = useQuery({
    queryKey: ['usersCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/usersCount`);
      return res.data;
    }
  })
  const {data: totalPostsCount = "0"} = useQuery({
    queryKey: ['totalPostsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/totalPostsCount`);
      return res.data;
    }
  })
  const {data: totalCommentsCount = "0"} = useQuery({
    queryKey: ['totalCommentsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/totalCommentsCount`);
      return res.data;
    }
  })

  const handleSubmit = e => {
    e.preventDefault();

    let tag = (e.target.tag.value).trim();
    tag = tag[0].toUpperCase() + tag.slice(1);

    axiosSecure.post('/tags', {tag})
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire(
            "Added!",
            "Tag added successfully",
            "success"
          )
          e.target.reset();
        }
      })
      .catch(error => toast.error(error.message));
  }

  return (
    <div>
      <Helmet>
        <title>Admin&apos;s Profile - CircleSync</title>
      </Helmet>

      <section className="text-center">
        <img className="w-32 rounded-full mx-auto mb-2" src={user?.photoURL} alt="User's Photo" />
        <h3 className="text-2xl font-medium">{user?.displayName}</h3>
        <span className="text-gray-500 block mb-3">{user?.email}</span>
        <span className="btn btn-primary">Admin</span>

        <div className="flex justify-center items-center gap-6 flex-wrap mt-10">
          <StatCard title="Total Users" value={usersCount?.totalUsers || 0} />
          <StatCard title="Total Posts" value={totalPostsCount} />
          <StatCard title="Total Posts" value={totalCommentsCount} />
        </div>

        <div className="mt-10">
          <h3 className="text-3xl font-medium text-primary mb-4">Add Tags:</h3>
          <form className="flex justify-center gap-4 max-w-[500px] mx-auto" onSubmit={handleSubmit}>
          <input className="flex-1 w-full input border-2 border-gray-300" type="text" name="tag" id="tag" placeholder="Add tag with single word" required />
            <button type="submit" className="btn btn-primary px-8">Add</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
}