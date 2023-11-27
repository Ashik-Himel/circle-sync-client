import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: 'https://circle-sync-server.vercel.app',
    // baseURL: 'http://localhost:5001'
  })

  return axiosSecure;
};

export default useAxiosSecure;