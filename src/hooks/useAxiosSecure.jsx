import axios from "axios";
import useUserContext from "./useUserContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";

const useAxiosSecure = () => {
  const {user} = useUserContext();

  const axiosSecure = axios.create({
    baseURL: 'https://circle-sync-server.vercel.app',
    // baseURL: 'http://localhost:5001',
    withCredentials: true,
    headers: {
      Authorization: user?.email
    }
  })

  axiosSecure.interceptors.response.use((response) => response, (error) => {
    if (error.response.data.message === "Token Missing") signOut(auth);
    else return Promise.reject(error);
  })

  return axiosSecure;
};

export default useAxiosSecure;