import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const MakeAnnouncement = () => {
  const {user} = useUserContext();
  const axiosSecure = useAxiosSecure();

  const handleSubmit = e => {
    e.preventDefault();

    const form = e.target;
    const announcement = {
      author: {
        name: form.authorName.value,
        email: form.authorEmail.value,
        photo: form.authorImage.value,
      },
      title: form.title.value,
      description: form.description.value,
    }
    
    axiosSecure.post('/announcements', announcement)
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire({
            title: "Announcement Added!",
            text: "Announcement Added Successfully!",
            icon: "success"
          });
          e.target.reset();
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
      <form className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 max-w-[800px] mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-medium text-center mb-6">Add Announcement</h2>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 mb-5">
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="authorName">Author&apos;s Name</label>
                <input className="input w-full border-gray-300 !bg-white" type="text" name="authorName" id="authorName" defaultValue={user?.displayName} disabled />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="authorEmail">Author&apos;s Email</label>
                <input className="input w-full border-gray-300 !bg-white" type="email" name="authorEmail" id="authorEmail" defaultValue={user?.email} disabled />
              </div>
            </div>

            <label className="block font-medium mb-2" htmlFor="authorImage">Author&apos;s Image</label>
            <input className="input w-full border-gray-300 !bg-white mb-5" type="url" name="authorImage" id="authorImage" defaultValue={user?.photoURL} disabled />

            <label className="block font-medium mb-2" htmlFor="title">Title</label>
            <input className="input w-full border-gray-300 mb-5" type="text" name="title" id="title" placeholder="Enter the announcement title" required />

            <label className="block font-medium mb-2" htmlFor="title">Description</label>
            <textarea className="input w-full border-gray-300 py-3 mb-5 resize-none h-[100px]" name="description" id="description" placeholder="Enter the announcement description" required></textarea>

            <button className="btn btn-primary btn-block">Add Announcement</button>
          </form>
      </section>
    </div>
  );
};

export default MakeAnnouncement;