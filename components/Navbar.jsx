"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Rubik_Storm } from "next/font/google";
import { FaRegCompass } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { FaMasksTheater } from "react-icons/fa6";
import { MdOutlineSearch } from "react-icons/md";
import MovieSearch from "./MovieSearch";

const rubikStorm = Rubik_Storm({
  subsets: ["latin"],
  weight: ["400"],
});

const Navbar = () => {
  const [openMovieSearch, setMovieSearch] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const navItems = [
    { href: "/", icon: FaRegCompass, label: "Explore" },
    { href: "/notifications", icon: FaRegBell, label: "Notifications" },
    { href: "/genres", icon: FaMasksTheater, label: "Genres" },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-50 shadow-2xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <span
                className={`logo ${rubikStorm.className} relative bg-black rounded-lg px-3 py-2 text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400`}
              >
                RM
              </span>
            </div>
            <span className="font-black text-2xl tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text hidden sm:inline">
              REMOVIE
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setActiveLink(href)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                  activeLink === href
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{label}</span>
                <div
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${
                    activeLink === href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></div>
              </Link>
            ))}
          </div>

          {/* Search Button */}
          <div
            onClick={() => setMovieSearch(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-gray-300 hover:text-white border border-cyan-500/30 hover:border-cyan-500/60 cursor-pointer transition-all duration-300 group"
          >
            <MdOutlineSearch size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium text-sm hidden sm:inline">Search</span>
            {openMovieSearch && (
              <MovieSearch
                isOpen={openMovieSearch}
                onClose={() => setMovieSearch(false)}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-end px-6 py-3 gap-4 border-t border-gray-800">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Icon size={20} />
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
