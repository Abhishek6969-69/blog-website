"use client";

import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Avatar } from "./Blogcards";


function Appbar() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("Abhishek");

  React.useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser && storedUser.name) {
        setUsername(storedUser.name);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-lg shadow-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="font-black text-2xl md:text-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Write Wave
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {/* Publish Button */}
            <button 
              onClick={() => navigate("/createblog")}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Write
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <Avatar name={username} w={40} h={40} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl mt-3 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{username}</p>
                  <p className="text-xs text-gray-500 mt-1">Manage your account</p>
                </div>
                
                <DropdownMenuItem
                  onSelect={() => navigate("/profile")}
                  className="cursor-pointer px-6 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center gap-3 transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => navigate("/blogs")}
                  className="cursor-pointer px-6 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center gap-3 transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  All Blogs
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuSeparator className="my-2 h-px bg-gray-100" />
                
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="cursor-pointer px-6 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center gap-3 transition-all duration-200 text-red-600 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appbar;
