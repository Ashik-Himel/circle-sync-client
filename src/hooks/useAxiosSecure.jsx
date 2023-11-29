import axios from "axios";
import useUserContext from "./useUserContext";

const useAxiosSecure = () => {
  const {user} = useUserContext();

  const axiosSecure = axios.create({
    baseURL: 'https://circle-sync-server.vercel.app',
    withCredentials: true,
    headers: {
      Authorization: user?.email
    }
  })

  return axiosSecure;
};

export default useAxiosSecure;