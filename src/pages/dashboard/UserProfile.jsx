import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import bronzeBadge from '../../assets/images/bronze.png';
import goldBadge from '../../assets/images/gold.png';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const {user, userRole} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const {data : posts = []} = useQuery({
    queryKey: ['posts', user?.email],
    queryFn: async() => {
      const res = await axiosSecure(`/posts/user/${user?.email}`);
      return res.data;
    }
  })

  return (
    <div>
      <Helmet>
        <title>My Profile - CircleSync</title>
      </Helmet>

      <section className="text-center">
        <img className="w-32 rounded-full mx-auto mb-2" src={user?.photoURL} alt="User's Photo" />
        <h3 className="text-2xl font-medium">{user?.displayName}</h3>
        <span className="text-gray-500">{user?.email}</span>

        <h3 className="mt-8 text-3xl font-medium text-primary mb-4">Badges:</h3>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <img className="w-[100px]" src={bronzeBadge} alt="Bronze Badge" />
          {userRole === 'gold' && <img className="w-[100px]" src={goldBadge} alt="Gold Badge" />}
        </div>

        <h3 className="mt-8 text-2xl font-medium text-primary mb-4">Recent Posts:</h3>
        <div className="overflow-x-auto">
          <table className="border border-black [&_th]:border [&_th]:border-black [&_td]:border [&_td]:border-black [&_th]:px-4 [&_th]:py-2 [&_th]:bg-primary [&_th]:text-white [&_td]:px-4 [&_td]:py-2 min-w-[650px] w-full max-w-[900px] mx-auto">
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Published</th>
                <th>Up Vote</th>
                <th>Down Vote</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {
                posts?.slice(0, 3)?.map(post => <tr key={post._id}>
                  <td>{post?.title}</td>
                  <td>{format(new Date(post?.publishedTime), "dd MMM, yyyy")}</td>
                  <td>{post?.upVote}</td>
                  <td>{post?.downVote}</td>
                  <td><Link to={`/dashboard/posts/${post._id}/comments`} className="btn btn-primary min-h-[32px]">View</Link></td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;