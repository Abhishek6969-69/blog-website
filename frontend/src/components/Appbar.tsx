
import { Avatar } from "./Blogcards"
import { Link, useNavigate } from "react-router-dom"

import { useState ,useEffect} from "react";

function Appbar() {
  const navigate=useNavigate();
  const [logout,setlogout]=useState(false);
  const [username,setusername]=useState("Abhishek")
  

useEffect(()=>{
  const token=localStorage.getItem('token');


  
  
  if(token){
    setlogout(false)
  }
  else{
    setlogout(true)
  }
},[logout])
useEffect(()=>{
  const storedUser = JSON.parse(localStorage.getItem("user") || "");
  setusername(storedUser.name)
 
},[])

const handalelogout=()=>{
  const token=localStorage.getItem('token');
  if(token){
    localStorage.removeItem('token');
    setlogout(!logout);
  }
  
}
  
  return (
    <div className=" flex justify-between items-center p-2  border-b-2  ">
     
      <div className=" font-serif ">
        <Link to={'/'}>Medium</Link></div>
      <div className=" flex items-center gap-10">
      <div>
        {
       (logout?<button onClick={()=>{
          navigate('/signup')
        }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Signup</button>:
        <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handalelogout}>Logout</button>)}
      <button onClick={()=>{
        navigate('/createblog')
      }} type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">New</button>
    </div>
      <div className="mb-3 "><Avatar name={username} w={40}  h={40}  /></div>
      
      </div>

    </div>
  )
}

export default Appbar 