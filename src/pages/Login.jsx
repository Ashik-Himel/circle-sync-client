import { Helmet } from "react-helmet-async";
import googleIcon from '../assets/images/google.png';
import { Link } from "react-router-dom";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from "react";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.config";
import useUserContext from "../hooks/useUserContext";

const Login = () => {
  const [showEye, setShowEye] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const {setUser} = useUserContext();

  const handleSubmit = e => {
    e.preventDefault();

    // Get values
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user)
        toast.success("Login Successful !!!");
      })
      .catch((error) => {
        toast.error(error.message);
      })
  }
  const googleLogin = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        setUser(userCredential.user)
        toast.success('Login Successful !!!');
      })
      .catch(error => {
        toast.error(error.code);
      })
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
          <form className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 max-w-[500px] mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-center text-3xl font-medium mb-6">Login</h2>
            <label className="block font-medium mb-2" htmlFor="email">Email</label>
            <input className="input w-full border-2 border-gray-300 mb-4" type="email" name="email" id="email" placeholder="Enter your email" required />

            <label className="block font-medium mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input className="input w-full border-2 border-gray-300" onChange={handlePassOnChange} type={showPass ? "text" : "password"} name="password" id="password" placeholder="Enter your password" required />
              {
                showEye ? showPass ? <FaEyeSlash className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl cursor-pointer select-none" onClick={() => setShowPass(!showPass)} /> : <FaEye className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl cursor-pointer select-none" onClick={() => setShowPass(!showPass)} /> : ''
              }
            </div>

            <button className="btn btn-primary btn-block mt-6" type="submit">Login</button>
            <p className="mt-4">Don&apos;t have an account? <Link to='/register' className="text-primary font-medium">Register Now</Link></p>
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