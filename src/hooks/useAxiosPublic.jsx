import axios from "axios";

const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: 'https://circle-sync-server.vercel.app',
    // baseURL: 'http://localhost:5001'
  })

  return axiosPublic;
};

export default useAxiosPublic;