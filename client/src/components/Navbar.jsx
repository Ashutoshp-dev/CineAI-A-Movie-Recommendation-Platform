import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo4 from "../assets/logo4.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import avatar4 from "../assets/avatar4.png";
import '../App.css'

const Navbar = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const [avatar, setAvatar] = useState(null);

  const [profileCol, setProfileCol] = useState({
    bg: "rgb(220,220,220)",
    text: "rgb(0,0,0)",
  });

  const randomColor = () => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const textCol = luminance > 150 ? "black" : "white";

    setProfileCol({
      bg: `rgb(${r},${g},${b})`,
      text: textCol,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out", error.message);
    }
  };
  const handleSelect = async (avatarChoice) => {
    if (avatarChoice === "male1") {
      setAvatar("male1");
      toast.success(`Avatar set to ${avatarChoice.slice(0, avatarChoice.length - 1)}`);
    } else if (avatarChoice === "male2") {
      setAvatar("male2");
      toast.success(`Avatar set to ${avatarChoice.slice(0, avatarChoice.length - 1)}`);
    } else if (avatarChoice === "female1") {
      setAvatar("female1");
      toast.success(`Avatar set to ${avatarChoice.slice(0, avatarChoice.length - 1)}`);
    } else if (avatarChoice === "female2") {
      setAvatar("female2");
      toast.success(`Avatar set to ${avatarChoice.slice(0, avatarChoice.length - 1)}`);
    }
    try {
      await fetch(`/user/set-avatar/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: avatarChoice }),
      });
    } catch (err) {
      toast.error("Failed to update avatar");
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
    try {
      const res = await fetch(`/user/${user.uid}`);
      const data = await res.json();
      if (data?.avatar) setAvatar(data.avatar);
      console.log("Fetching avatar for user:", user.uid);
console.log("Fetched data:", data);
    } catch (err) {
      console.error("Error fetching avatar:", err);
    }
  };
   if (user?.uid) {
    fetchAvatar();
  }
    randomColor();
  }, [user?.uid]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="w-full h-[4rem] flex justify-between pl-3 text-white fixed z-50 bg-black/40 backdrop-blur-md">
      <div className=" h-[4rem] w-[4rem] flex items-center text-3xl cursor-pointer gap-1 relative">
        <img src={logo4} alt="" className="absolute top-0 left-0 h-[4rem] w-[4rem] " />
        <h2 className="flex absolute bg-transparent items-center justify-center top-0 left-[4rem] py-5 text-3xl text-orange-400 font-bold"><span className="text-[rgb(0,143,212)] bg-transparent">Cine</span><span className="text-[rgb(182,1,36)] bg-transparent">AI</span></h2>
      </div>
      <div className="right flex gap-5 w-[20%] min-w-[25rem] pr-10 justify-end items-center opacity-100 text-white">
        <ul className="flex gap-4 items-center max-sm:hidden">
          <Link
            to="/"
            className="hover:border-b-4 py-2 hover:border-b-blue-950 hover:font-bold hover:text-blue-300"
          >
            <li>Home</li>
          </Link>
          <Link
            to="/movies/liked"
            className="hover:border-b-4 py-2 hover:border-b-blue-950 hover:text-blue-300"
          >
            <li>Liked Movies</li>
          </Link>
          <Link
            to="/movies/saved"
            className="hover:border-b-4 py-2 hover:border-b-blue-950 hover:text-blue-300"
          >
            <li>Saved Movies</li>
          </Link>
        </ul>
        {user ? (
          <div
            className="relative w-[3rem] h-[3rem] min-w-[3rem] max-w-[4rem] rounded-full flex justify-center items-center aspect-square"
            ref={menuRef}
          >
            <div
              style={{ backgroundColor: profileCol.bg, color: profileCol.text }}
              className="profile flex justify-center items-center text-xl font-semibold rounded-full px-4 py-2 w-[100%] h-[100%] cursor-pointer relative"
              onClick={() => setShowMenu(!showMenu)}
            >
              {avatar ? (
                <img
                  src={
                    avatar === "male1"
                      ? avatar1
                      : avatar === "male2"
                      ? avatar2
                      : avatar === "female1"
                      ? avatar3
                      : avatar4
                  }
                  alt="Avatar"
                  className="absolute top-0 left-0 w-[55px] h-[55px] rounded-full object-cover"
                />
              ) : user.displayName ? (
                user.displayName.charAt(0).toUpperCase()
              ) : (
                user.email.charAt(0).toUpperCase()
              )}
            </div>
            {showMenu && (
              <div className="absolute flex flex-col items-center top-[3.5rem] right-0 bg-black text-white shadow-md p-3 z-50 min-w-[15rem] rounded-xl">
                <p className="font-semibold" style={{ color: profileCol.bg }}>
                  Hii, {user.displayName || user.email.split("@")[0]}
                </p>
                <ul className="flex flex-col gap-4 items-center max-sm:visible">
          <Link
            to="/"
            className="hover:border-b-4 py-2 hover:border-b-blue-950 hover:font-bold hover:text-blue-300"
          >
            <li>Home</li>
          </Link>
          <Link
            to="/movies/liked"
            className="hover:border-b-4 py-2 hover:border-b-blue-950 hover:text-blue-300"
          >
            <li>Liked Movies</li>
          </Link>
          <Link
            to="/movies/saved"
            className="hover:border-b-4 py-2 hover:border-b-blue-950 hover:text-blue-300"
          >
            <li>Saved Movies</li>
          </Link>
        </ul>
                <div className="flex flex-col items-center mt-2">
                  <span className="">Want your avatar? </span>
                  <div className="grid grid-cols-2 gap-4 p-2 relative h-[100%] w-[100%] pt-2">
                    <img
                      src={avatar1}
                      onClick={() => handleSelect("male1")}
                      className="w-[3.5rem] h-[3.5rem] object-fill hover:scale-110 transition rounded-full border border-gray-500 cursor-pointer backdrop-blur-md bg-white/30"
                    />
                    <img
                      src={avatar2}
                      onClick={() => handleSelect("male2")}
                      className="w-[3.5rem] h-[3.5rem] object-fill hover:scale-110 transition rounded-full border border-gray-500 cursor-pointer backdrop-blur-md bg-white/30"
                    />
                    <img
                      src={avatar3}
                      onClick={() => handleSelect("female1")}
                      className="w-[3.5rem] h-[3.5rem] object-fill hover:scale-110 transition rounded-full border border-gray-500 cursor-pointer backdrop-blur-md bg-white/30"
                    />
                    <img
                      src={avatar4}
                      onClick={() => handleSelect("female2")}
                      className="w-[3.5rem] h-[3.5rem] object-fill hover:scale-110 transition rounded-full border border-gray-500 cursor-pointer backdrop-blur-md bg-white/30"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <p>To remove avatar: </p>
                  <span className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => {if(avatar){setAvatar(null); toast.success("Avatar removed successfully")}else{toast.warn("No avatar to remove")}}}
                  >
                    Click here
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-2 text-red-600 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signup" className="hover:text-green-300">
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
