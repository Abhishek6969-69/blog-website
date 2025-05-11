"use client";

import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Avatar } from "./Blogcards";
import { Button } from "./ui/button";
// import { Codepen } from 'lucide-solid';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function Appbar() {
  const navigate = useNavigate();
  const [logout, setLogout] = React.useState(false);
  const [username, setUsername] = React.useState("Abhishek");
  
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setLogout(!token);
  }, []);

  React.useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser && storedUser.name) {
        setUsername(storedUser.name);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:",error );
      console.log(logout)
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    setLogout(true);
    navigate("/signup");
  };

  return (
    <div className="flex justify-between items-center p-2 py-4 border-b-2">
      <div className="font-serif">
        <Link to="/landingpage">
          <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faSnowflake} />

            <p className="font-extrabold text-[13px] md:text-[25px] mr-3">Blogify</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-10">
        

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/createblog")}>
          {/* <TfiWrite className="size-10" /> */}
          <Button >Start Publishing</Button>
          
        </div>

      
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar name={username} w={40} h={40} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => navigate("/profile")}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
               Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => navigate("/settings")}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={handleLogout}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Appbar;
