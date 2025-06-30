import React from "react";
import footerImg from "../assets/glow.svg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-auto bg-gray-950 text-white pt-10 px-5 gap-5 flex flex-col items-center"
          >
            <div className="flex gap-[5rem] w-1/2 items-center justify-center">
                <div className="Links flex flex-col gap-3 items-center px-10 border-r-2 border-l-2 border-blue-500">
                    <h2 className="pb-2 text-xl text-amber-500 cursor-default text-center">Links</h2>
                    <Link to="/" className="hover:text-gray-400">Home</Link>
                    <Link to="/movies/liked" className="hover:text-gray-400">Liked Movies</Link>
                    <Link to="/movies/saved" className="hover:text-gray-400">Saved Movies</Link>
                </div>
                <div className="Connect flex flex-col gap-3 items-center px-10 border-r-2 border-l-2 border-red-500">
                    <h2 className="pb-2 text-xl text-amber-500 cursor-default text-center">Connect with Me</h2>
                    <Link to="https://www.instagram.com/ashux0001/" className="hover:text-gray-400">Instagram</Link>
                    <Link to="https://www.linkedin.com/in/ashutoshpandey0512" className="hover:text-gray-400">LinkedIn</Link>
                    <Link to="https://www.github.com/Ashutoshp-dev" className="hover:text-gray-400">GitHub</Link>
                </div>
            </div>

      <div className="relative text-center py-10">
        <h1 className="text-6xl py-10 md:text-8xl font-bold  bg-gradient-to-b from-white/70 to-gray-900 text-transparent bg-clip-text select-none">
          CineAI
        </h1>
      </div>
      <img
        src={footerImg}
        alt=""
        className="absolute bottom-0 w-[100%] h-[5rem] "
      />
    </motion.section>
  );
};

export default Footer;
