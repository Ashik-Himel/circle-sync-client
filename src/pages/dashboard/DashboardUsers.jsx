import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

const DashboardUsers = () => {
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState('');
  const axiosSecure = useAxiosSecure();
  const {data: users = [], isLoading, refetch} = useQuery({
    queryKey: ['users', searchVal],
    queryFn: async() => {
      const res = await axiosSecure(`/users?search=${searchVal}&skip=${page-1}`)
      return res.data;
    }
  })

  const {data: usersCount = 0, isLoading: isLoading2} = useQuery({
    queryKey: ['usersCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/usersCount`);
      return res.data;
    }
  })

  let pageTrack = [];
  if (!isLoading2) {
    for (let i = 1; i <= Math.ceil(usersCount / 10); i++) {
      pageTrack.push(i);
    }
  }

  useEffect(() => {
    refetch();
  }, [page, refetch]);

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
  const handleOnChange = e => {
    const value = e.target.value;
    setSearchVal(value);
    refetch();
  }

  return (
    <div>
      <Helmet>
        <title>Manage Users - CircleSync</title>
      </Helmet>

      <section>
        <h2 className="text-3xl font-medium text-center mb-4 text-primary">All Users</h2>
        <div className='w-full max-w-[500px] mx-auto relative mb-4'>
          <input className='input w-full pr-12 border-2 border-gray-300 bg-gray-50' type="search" name="search" id="search" placeholder='Search by tag' onChange={handleOnChange} />
          <IoSearch className='absolute right-4 top-1/2 -translate-y-1/2 text-2xl' />
        </div>

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
                !isLoading ? users?.map(user => <tr key={user._id}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td className={user?.role === 'admin' ? "font-semibold text-primary" : user?.role === 'gold' ? "font-semibold text-yellow-500" : "font-semibold"}>{user?.role === 'admin' ? user?.role[0].toUpperCase() + user?.role?.slice(1) : user?.role[0].toUpperCase() + user?.role?.slice(1) + " Member"}</td>
                  <td className="min-w-[170px]">
                    <button className="btn btn-primary min-h-[32px] py-1" disabled={user?.role === 'admin' ? 'disabled' : ''} onClick={() => handleMakeAdmin(user?._id)}>{user?.role === 'admin' ? "Admin" : "Make Admin"}</button>
                  </td>
                </tr>) : <tr>
                  <td colSpan='4'>
                    <div className="my-1 text-center">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div>
            <nav className="flex justify-between items-center gap-4 py-3 flex-wrap">
              <div>
                <span>Showing {Math.min(((page-1) * 10)+1, usersCount)}-{Math.min(page*10, usersCount)} of {usersCount}</span>
              </div>
              <ul className="flex flex-wrap justify-center items-center -space-x-px text-sm">
                <li>
                  <button className="flex items-center justify-center px-3 h-8 ml-0 leading-tight bg-white border border-gray-500 rounded-l-lg hover:bg-primary hover:text-white disabled:!bg-gray-300 disabled:!text-black disabled:cursor-not-allowed" disabled={page === 1 ? "disabled" : ""} onClick={() => setPage(page-1)}>Prev</button>
                </li>
                {
                  pageTrack?.map(pageNum => <li key={pageNum}>
                    <button className="flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-500 hover:bg-primary hover:text-white" style={pageNum === page ? {backgroundColor: "#38A1E3", color: "white"} : {}} onClick={() => setPage(pageNum)}>{pageNum}</button>
                  </li>)
                }
                <li>
                  <button className="flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-500 rounded-r-lg hover:bg-primary hover:text-white disabled:!bg-gray-300 disabled:!text-black disabled:cursor-not-allowed" disabled={page === pageTrack?.length ? "disabled" : ""} onClick={() => setPage(page+1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardUsers;