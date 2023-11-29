import { Helmet } from "react-helmet-async";
import googleIcon from '../assets/images/google.png';
import { Link, useLocation } from "react-router-dom";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from "react";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.config";
import useUserContext from "../hooks/useUserContext";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const Login = () => {
  const [showEye, setShowEye] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const {setUser, setUserRole} = useUserContext();
  const axiosPublic = useAxiosPublic();
  const {state} = useLocation();
  const {register, handleSubmit} = useForm();

  const onSubmit = data => {
    const email = data.email;
    const password = data.password;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        axiosPublic.post('/users', {email}, {withCredentials: true})
          .then(res => {
            toast.success('Login Successful !!!');
            setUser(userCredential.user);
            setUserRole(res.data?.role);
          })
          .catch(error => toast.error(error.message))
      })
      .catch((error) => toast.error(error.message))
  }
  const googleLogin = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        axiosPublic.post('/users', {email: userCredential.user?.email, name: userCredential.user?.displayName}, {withCredentials: true})
          .then(res => {
            if (res.data.insertedId) {
              Swal.fire({
                title: "Congrats!",
                text: "You earned bronze badge!",
                icon: "success"
              });
              setUserRole("bronze");
            } else {
              toast.success('Login Successful !!!');
            }
            setUser(userCredential.user);
          })
          .catch(error => toast.error(error.message));
      })
      .catch(error => toast.error(error.message));
  }
  const handlePassOnChange = e => {
    const password = e.target.value;
    if (password) setShowEye(true);
    else setShowEye(false);
  }

  return (
    <main>
      <Helmet>
        <title>Login - CircleSync</title>
      </Helmet>

      <section className="mt-12">
        <div className="container">
          <form className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 max-w-[500px] mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center text-3xl font-medium mb-6">Login</h2>
            <label className="block font-medium mb-2" htmlFor="email">Email</label>
            <input className="input w-full border-2 border-gray-300 mb-4" type="email" {...register('email')} id="email" placeholder="Enter your email" required />

            <label className="block font-medium mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input className="input w-full border-2 border-gray-300" onChange={handlePassOnChange} type={showPass ? "text" : "password"} {...register('password')} id="password" placeholder="Enter your password" required />
              {
                showEye ? showPass ? <FaEyeSlash className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl cursor-pointer select-none" onClick={() => setShowPass(!showPass)} /> : <FaEye className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl cursor-pointer select-none" onClick={() => setShowPass(!showPass)} /> : ''
              }
            </div>

            <div className="mt-6 text-center">
              <AwesomeButton type="primary">Login</AwesomeButton>
            </div>
            <p className="mt-4">Don&apos;t have an account? <Link to='/register' className="text-primary font-medium" state={state}>Register Now</Link></p>
            <div className="divider py-4">OR</div>
            <button type="button" className="w-full border-2 border-black rounded-full flex justify-center items-center gap-4 py-2 px-4 font-medium" onClick={googleLogin}>
              <img className="w-6" src={googleIcon} alt="Google Icon" />
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;