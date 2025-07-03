import React from "react";
import "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../App.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredentials.user, {
        displayName: username,
      });
      toast.success("User signed up successfully");
      navigate("/");
    } catch (err) {
      toast.error("Error signing up");
      setError(err.message);
    }
  };
  const handleGoogleSignIn = async (e) => {
    try {
      const UserFromGoogle = await signInWithPopup(auth, googleProvider);
      toast.success("Google sign-in successful");
      navigate("/");
    } catch (err) {
      toast.error("Error signing in with Google");
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[50%] h-screen bg-gray-900 text-white">
      <h2 className="text-3xl py-5 border-b-2">Sign Up</h2>
      {error && <p className="text-red-400 pt-5">{error}</p>}
      <form className="flex flex-col gap-4 w-[100%] items-center text-amber-200 pt-5">
        <div className="flex justify-around items-center gap-10 p-5 w-full">
          <label htmlFor="username" className="text-xl">
            Username:
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            name="username"
            className="border-1 border-amber-100 rounded w-[50%] h-[3rem] pl-2 min-w-[8rem] "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-around items-center gap-10 p-5 w-full">
          <label htmlFor="email" className="text-xl">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            name="email"
            className="border-1 border-amber-100 rounded w-[50%] h-[3rem] pl-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-around items-center gap-10 p-5 w-full">
          <label htmlFor="password" className="text-xl">
            Password:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            name="password"
            className="border-1 border-amber-100 rounded w-[50%] h-[3rem] pl-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          type="submit"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </form>

      <div className="mt-4">
        <span>Or sign up with: </span>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 px-4 py-2 rounded mt-2"
        >
          Google
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;
