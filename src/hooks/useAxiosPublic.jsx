import axios from "axios";

const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: 'https://circle-sync-server.vercel.app'
  })

  return axiosPublic;
};

export default useAxiosPublic;