import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const MakeAnnouncement = () => {
  const {user} = useUserContext();
  const axiosSecure = useAxiosSecure();
  const {register, handleSubmit, reset} = useForm();

  const onSubmit = data => {
    const announcement = {
      author: {
        name: data.authorName,
        email: data.authorEmail,
        photo: data.authorImage,
      },
      title: data.title,
      description: data.description,
    }
    
    axiosSecure.post('/announcements', announcement)
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire({
            title: "Announcement Added!",
            text: "Announcement Added Successfully!",
            icon: "success"
          });
          reset();
        }
      })
      .catch(error => toast.error(error.message));
  }
  
  return (
    <div>
      <Helmet>
        <title>Make Announcement - CircleSync</title>
      </Helmet>

      <section>
      <form className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 max-w-[800px] mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-3xl font-medium text-center mb-6">Make Announcement</h2>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 mb-5">
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="authorName">Author&apos;s Name</label>
                <input className="input opacity-60 cursor-not-allowed w-full border-gray-300 !bg-white" type="text" {...register("authorName")} id="authorName" defaultValue={user?.displayName} readOnly />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="authorEmail">Author&apos;s Email</label>
                <input className="input opacity-60 cursor-not-allowed w-full border-gray-300 !bg-white" type="email" {...register("authorEmail")} id="authorEmail" defaultValue={user?.email} readOnly />
              </div>
            </div>

            <label className="block font-medium mb-2" htmlFor="authorImage">Author&apos;s Image</label>
            <input className="input opacity-60 cursor-not-allowed w-full border-gray-300 !bg-white mb-5" type="url" {...register("authorImage")} id="authorImage" defaultValue={user?.photoURL} readOnly />

            <label className="block font-medium mb-2" htmlFor="title">Title</label>
            <input className="input w-full border-gray-300 mb-5" type="text" {...register("title")} id="title" placeholder="Enter the announcement title" required />

            <label className="block font-medium mb-2" htmlFor="title">Description</label>
            <textarea className="input w-full border-gray-300 py-3 mb-5 resize-none h-[100px]" {...register("description")} id="description" placeholder="Enter the announcement description" required></textarea>

            <div className="text-center">
              <AwesomeButton type="primary">Make Announcement</AwesomeButton>
            </div>
          </form>
      </section>
    </div>
  );
};

export default MakeAnnouncement;