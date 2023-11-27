import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ReportedComments = () => {
  const axiosSecure = useAxiosSecure();
  const {data: reportedComments = [], refetch} = useQuery({
    queryKey: ['reportedComments'],
    queryFn: async() => {
      const res = await axiosSecure('/reportedComments');
      return res.data;
    }
  })

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
      </section>
    </div>
  );
};

export default ReportedComments;