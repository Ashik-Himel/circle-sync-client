import { Helmet } from "react-helmet-async";
import useUserContext from "../../hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {FaRegFaceSadTear} from 'react-icons/fa6';
import { Link } from "react-router-dom";
import Select from 'react-select';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AddPost = () => {
  const {user, userRole} = useUserContext();
  const [selectedTag, setSelectedTag] = useState(null);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const {data: postsCount = 0, isLoading} = useQuery({
    queryKey: ['postsCount'],
    queryFn: async() => {
      const res = await axiosSecure(`/postsCount?email=${user?.email}`);
      return res.data;
    }
  })

  const {data: allTags = []} = useQuery({
    queryKey: ['tags'],
    queryFn: async() => {
      const res = await axiosPublic('/tags');
      return res.data;
    }
  })
  const options = allTags?.map(tag => {
    return {
      value: tag?.tag,
      label: tag?.tag
    }
  });

  const handleSubmit = e => {
    e.preventDefault();

    const form = e.target;
    const post = {
      author: {
        name: form.authorName.value,
        email: form.authorEmail.value,
        photo: form.authorImage.value,
      },
      title: form.title.value,
      description: form.description.value,
      tag: selectedTag?.value,
      upVote: form.upVote.value,
      downVote: form.downVote.value,
      publishedTime: new Date().toISOString()
    }
    
    axiosSecure.post('/posts', post)
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire({
            title: "Post Added!",
            text: "Post Added Successfully!",
            icon: "success"
          });
          e.target.reset();
        }
      })
      .catch(error => toast.error(error.message));
  }

  if (isLoading) {
    return (
      <main className="mt-10 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </main>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Add Post - CircleSync</title>
      </Helmet>

      <section>
        {
          postsCount >= 5 && userRole === "bronze" ? <div className="mt-10 text-center">
            <FaRegFaceSadTear className="mx-auto text-[150px] text-primary mb-4" />
            <h2 className="text-3xl font-medium mb-2">Post Limit Exceed !</h2>
            <p className="text-gray-500 max-w-[500px] mx-auto mb-4">Your post limit is over. Get gold membership to add unlimited posts.</p>
            <Link to='/membership' className="btn btn-primary">Membership</Link>
          </div> : <form className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 max-w-[800px] mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-medium text-center mb-6">Add Post</h2>
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

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 mb-5">
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="authorImage">Author&apos;s Image</label>
                <input className="input w-full border-gray-300 !bg-white" type="url" name="authorImage" id="authorImage" defaultValue={user?.photoURL} disabled />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="tag">Post Tag</label>
                <Select options={options} onChange={(selected) => setSelectedTag(selected)} />
              </div>
            </div>

            <label className="block font-medium mb-2" htmlFor="title">Post Title</label>
            <input className="input w-full border-gray-300 mb-5" type="text" name="title" id="title" placeholder="Enter the post title" required />

            <label className="block font-medium mb-2" htmlFor="title">Post Title</label>
            <textarea className="input w-full border-gray-300 py-3 mb-5 resize-none h-[100px]" name="description" id="description" placeholder="Enter the post description" required></textarea>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 mb-5">
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="upVote">Up Vote</label>
                <input className="input w-full border-gray-300 !bg-white" type="number" name="upVote" id="upVote" defaultValue="0" disabled />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-2" htmlFor="downVote">Down Vote</label>
                <input className="input w-full border-gray-300 !bg-white" type="number" name="downVote" id="downVote" defaultValue="0" disabled />
              </div>
            </div>

            <button className="btn btn-primary btn-block">Add Post</button>
          </form>
        }
      </section>
    </div>
  );
};

export default AddPost;