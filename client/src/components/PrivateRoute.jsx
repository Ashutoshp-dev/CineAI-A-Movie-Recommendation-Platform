import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { Navigate, useLocation } from "react-router-dom";
import '../App.css';
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/signin") {
      toast("To see liked or saved movies, you must have an account.",{
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "info",
        theme: "dark",
      });
    }
  }, [user, loading, location]);

  if (loading) {
    return (
      <section className="flex items-center justify-center bg-black text-white min-h-screen w-full">
      <div className="loader z-10"></div>
      <div className="text-6xl font-bold text-orange-400 z-50"><span>Cine</span><span>AI</span></div>
    </section>

    );
  }
  return user ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;

