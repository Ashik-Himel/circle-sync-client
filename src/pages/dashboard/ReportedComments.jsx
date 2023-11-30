import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const ReportedComments = () => {
  const [page, setPage] = useState(1);
  const axiosSecure = useAxiosSecure();
  const {data: reportedComments = [], refetch} = useQuery({
    queryKey: ['reportedComments'],
    queryFn: async() => {
      const res = await axiosSecure(`/reportedComments?skip=${page-1}`);
      return res.data;
    }
  })

  const {data: reportedCommentsCount = 0, isLoading: isLoading2} = useQuery({
    queryKey: ['reportedCommentsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/reportedCommentsCount`);
      return res.data;
    }
  })

  let pageTrack = [];
  if (!isLoading2) {
    for (let i = 1; i <= Math.ceil(reportedCommentsCount / 10); i++) {
      pageTrack.push(i);
    }
  }

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handleDelete = id => {
    Swal.fire({
      title: "Delete Comment?",
      text: "Are you sure to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/reportedComments/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "This comment is deleted successfully.",
                icon: "success"
              });
              refetch();
            }
          })
      }
    });
  }
  const handleReject = id => {
    Swal.fire({
      title: "Reject Report?",
      text: "Are you sure to reject this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.put(`/reportedComments/${id}`, {reportStatus: "Rejected"})
          .then(res => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                title: "Rejected!",
                text: "The report is rejected successfully.",
                icon: "success"
              });
              refetch();
            }
          })
      }
    });
  }
  const handleCommentView = comment => {
    Swal.fire({
      text: comment,
      confirmButtonText: "Close"
    })
  }

  return (
    <div>
      <Helmet>
        <title>Reported Comments - CircleSync</title>
      </Helmet>

      <section>
        <h2 className="text-3xl font-medium text-center mb-4 text-primary">Reported Comments</h2>

        <div className="overflow-x-auto">
          <table className="border border-black [&_th]:border [&_th]:border-black [&_td]:border [&_td]:border-black [&_th]:px-4 [&_th]:py-2 [&_th]:bg-primary [&_th]:text-white [&_td]:px-4 [&_td]:py-2 min-w-[700px] w-full max-w-[900px] mx-auto text-center">
            <thead>
              <tr>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                reportedComments?.map(comment => <tr key={comment._id}>
                  <td>
                    {
                      comment?.comment.length > 20 ? <div>
                        {comment?.comment.slice(0, 20)}... <button className="text-primary font-semibold" onClick={() => handleCommentView(comment?.comment)}>Read More</button>
                      </div> : comment?.comment
                    }
                  </td>
                  <td>{comment.feedback}</td>
                  <td className="min-w-[370px]">
                    <div className="flex justify-center items-center gap-2">
                      <button className="btn btn-primary min-h-[32px] py-1" onClick={() => handleDelete(comment?._id)}>Delete Comment</button>
                      <button className="btn btn-error text-white min-h-[32px] py-1" onClick={() => handleReject(comment?._id)}>Reject Report</button>
                    </div>
                  </td>
                </tr>)
              }
            </tbody>
          </table>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div>
            <nav className="flex justify-between items-center gap-4 py-3 flex-wrap">
              <div>
                <span>Showing {Math.min(((page-1) * 10)+1, reportedCommentsCount)}-{Math.min(page*10, reportedCommentsCount)} of {reportedCommentsCount}</span>
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

export default ReportedComments;