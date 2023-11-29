import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Chart } from "react-google-charts";
import { useForm } from "react-hook-form";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

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
  const axiosPublic = useAxiosPublic();
  const {register, handleSubmit, reset} = useForm();

  const {data: usersCount = {}} = useQuery({
    queryKey: ['usersCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/usersCount`);
      return res.data;
    }
  })
  const {data: totalPostsCount = "0"} = useQuery({
    queryKey: ['totalPostsCount'],
    queryFn: async() => {
      const res = await axiosPublic(`/totalPostsCount`);
      return res.data;
    }
  })
  const {data: totalCommentsCount = {}} = useQuery({
    queryKey: ['totalCommentsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/totalCommentsCount`);
      return res.data;
    }
  })

  let data = [
    ["Title", "Value"],
    ["Users", parseInt(usersCount?.totalUsers)],
    ["Posts", parseInt(totalPostsCount)],
    ["Comments", parseInt(totalCommentsCount?.totalComments)],
  ];
  const options = {
    legend: "none",
    colors: ["#00C49F", "#FF444A", "#0984e3"],
    backgroundColor: 'none'
  };

  const onSubmit = data => {
    let tag = (data.tag).trim();
    tag = tag[0].toUpperCase() + tag.slice(1);

    axiosSecure.post('/tags', {tag})
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire(
            "Added!",
            "Tag added successfully",
            "success"
          )
          reset();
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
        <AwesomeButton type="primary">Admin</AwesomeButton>

        <div className="-mt-[30px] -mb-[50px]">
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={400}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <StatCard title="Total Users" value={"" + usersCount?.totalUsers || "0"} />
          <StatCard title="Total Posts" value={"" + totalPostsCount} />
          <StatCard title="Total Comments" value={"" + totalCommentsCount?.totalComments} />
        </div>

        <div className="my-10">
          <h3 className="text-3xl font-medium text-primary mb-4">Add Tags:</h3>
          <form className="flex justify-center gap-4 max-w-[500px] mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <input className="flex-1 w-full input border-2 border-gray-300" type="text" {...register("tag")} id="tag" placeholder="Add tag with single word" required />
            <button type="submit">
              <AwesomeButton type="primary">Add</AwesomeButton>
            </button>
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