import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error("Error logging in");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error("Error logging in");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl pb-5 border-b-2">Login</h2>
      {error && <p className="text-red-400 pt-5">{error}</p>}
      <form className="flex flex-col gap-4 w-[100%] items-center text-amber-200 pt-5" onSubmit={handleLogin}>
        <div className="flex justify-around items-center gap-10 p-5 w-full">
          <label className="text-xl">Email:</label>
          <input
            type="email"
            className="border border-amber-100 rounded w-[50%] h-[3rem] pl-2"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-around items-center gap-10 p-5 w-full">
          <label className="text-xl">Password:</label>
          <input
            type="password"
            className="border border-amber-100 rounded w-[50%] h-[3rem] pl-2"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" type="submit">
          Login
        </button>
      </form>
      <div className="mt-4">
        <span>Or login with: </span>
        <button onClick={handleGoogleLogin} className="bg-blue-500 px-4 py-2 rounded mt-2">Google</button>
      </div>
      <div>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn