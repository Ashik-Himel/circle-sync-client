import { Helmet } from "react-helmet-async";
import useUserContext from "../hooks/useUserContext";
import { useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../firebase.config";
import toast from "react-hot-toast";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";
import googleIcon from '../assets/images/google.png';
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const Register = () => {
  const {setUser, setUserRole} = useUserContext();
  const [showPass, setShowPass] = useState(false);
  const [showEye, setShowEye] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const axiosPublic = useAxiosPublic();
  const {state} = useLocation();
  const {register, handleSubmit, watch} = useForm();

  const onSubmit = data => {
    const displayName = data.name;
    const photoURL = data.photo;
    const email = data.email;
    const password = data.password;
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {displayName, photoURL})
          .then(() => {
            axiosPublic.post('/users', {email, name: userCredential.user?.displayName}, {withCredentials: true})
              .then(res => {
                if (res.data.insertedId) {
                  Swal.fire({
                    title: "Congrats!",
                    text: "You earned bronze badge!",
                    icon: "success"
                  });
                  setUser(userCredential.user);
                  setUserRole("bronze");
                }
              })
              .catch(error => toast.error(error.message))
          })
          .catch((error) => toast.error(error.message))
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
              setUserRole(res.data?.role);
            }
            setUser(userCredential.user);
          })
          .catch(error => toast.error(error.message))
      })
      .catch(error => toast.error(error.code))
  }
  
  const password = watch("password");
  useEffect(()=> {
    if (password) {
      setIsActive(false);
      setErrorMsg("");
      if (password) setShowEye(true)
      else setShowEye(false)

      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters!");
        return;
      }
      else if (!/[A-Z]/.test(password)) {
        setErrorMsg("At least one uppercase character required!");
        return;
      }
      else if (!/[0-9]/.test(password)) {
        setErrorMsg("At least one number required!");
        return;
      }
      else if (!/[^A-Za-z0-9]/.test(password)) {
        return setErrorMsg("At least one special character required!");
      }
      setIsActive(true);
    }
  }, [password])

  return (
    <main>
      <Helmet>
        <title>Register - CircleSync</title>
      </Helmet>

      <section className="mt-12">
        <div className="container">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 max-w-[500px] mx-auto">
            <h2 className="text-center text-3xl font-medium mb-6">Register</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name" className="block font-medium mb-2">Your Name</label>
              <input className="input w-full border-2 border-gray-300 mb-4" type="text" {...register("name")} id="name" placeholder="Enter your name" required />

              <label htmlFor="photo" className="block font-medium mb-2">Photo URL</label>
              <input className="input w-full border-2 border-gray-300 mb-4" type="url" {...register("photo")} id="photo" placeholder="Enter your photo url" required />

              <label htmlFor="email" className="block font-medium mb-2">Email</label>
              <input className="input w-full border-2 border-gray-300 mb-4" type="email" {...register("email")} id="email" placeholder="Enter your email address" required />

              <label htmlFor="password" className="block font-medium mb-2">Password</label>
              <div className="relative">
                <input className="input w-full border-2 border-gray-300" type={showPass ? "text": "password"} {...register("password")} name="password" id="password" placeholder="Enter your password" required />
                {
                  showEye ? showPass ? <FaEyeSlash className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl cursor-pointer" onClick={() => setShowPass(!showPass)} /> : <FaEye className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl cursor-pointer" onClick={() => setShowPass(!showPass)} /> : ''
                }
              </div>
              <p className="text-red-600 font-medium mt-3">{errorMsg}</p>

              <div className="flex items-center gap-1 mt-5">
                <input className="cursor-pointer" type="checkbox" name="terms_and_conditions" id="terms_and_conditions" required />
                <label htmlFor="terms_and_conditions">Accept <Link className="text-primary font-medium">Terms and Conditions</Link></label>
              </div>

            <button type="submit" className="btn btn-primary btn-block mt-5" disabled={!isActive}>Register</button>
            </form>
            <p className="mt-4">Already have an account? <Link to='/login' className="text-primary font-medium" state={state}>Login</Link></p>

            <div className="divider py-4">OR</div>

            <button className="flex justify-center items-center gap-2 border-2 border-black px-4 py-2 rounded-full w-full font-medium" onClick={googleLogin}>
              <img className="w-6" src={googleIcon} alt="Google Icon" /> Login in with Google
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;