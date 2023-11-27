import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const DashboardUsers = () => {
  const axiosSecure = useAxiosSecure();
  const {data: users = [], refetch} = useQuery({
    queryKey: ['users'],
    queryFn: async() => {
      const res = await axiosSecure('/users')
      return res.data;
    }
  })

  const handleMakeAdmin = id => {
    Swal.fire({
      title: "Make Admin?",
      text: "Are you sure to make this user to admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Make!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.put(`users/${id}`, {role: "admin"})
          .then(res => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                title: "Successful!",
                text: "This user is now an admin.",
                icon: "success"
              });
              refetch();
            }
          })
      }
    });
  }

  return (
    <div>
      <Helmet>
        <title>Manage Users - CircleSync</title>
      </Helmet>

      <section>
        <h2 className="text-3xl font-medium text-center mb-4 text-primary">All Users</h2>

        <div className="overflow-x-auto">
          <table className="border border-black [&_th]:border [&_th]:border-black [&_td]:border [&_td]:border-black [&_th]:px-4 [&_th]:py-2 [&_th]:bg-primary [&_th]:text-white [&_td]:px-4 [&_td]:py-2 min-w-[650px] w-full max-w-[900px] mx-auto text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                users?.map(user => <tr key={user._id}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td className={user?.role === 'admin' ? "font-semibold text-primary" : user?.role === 'gold' ? "font-semibold text-yellow-500" : "font-semibold"}>{user?.role === 'admin' ? user?.role[0].toUpperCase() + user?.role?.slice(1) : user?.role[0].toUpperCase() + user?.role?.slice(1) + " Member"}</td>
                  <td className="min-w-[170px]">
                    <button className="btn btn-primary min-h-[32px] py-1" disabled={user?.role === 'admin' ? 'disabled' : ''} onClick={() => handleMakeAdmin(user?._id)}>{user?.role === 'admin' ? "Admin" : "Make Admin"}</button>
                  </td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardUsers;