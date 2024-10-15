import { useEffect } from "react";
import { Avatar } from "./Blogcards"
import { Link, useNavigate } from "react-router-dom"

function Appbar() {
  const navigate=useNavigate();
  
 
  
  return (
    <div className=" flex justify-between p-3  border-b-2  ">
      <div className=" ">
        <Link to={'/'}>Medium</Link></div>
      <div className=" flex items-center gap-10">
      <div>
      <button onClick={()=>{
        navigate('/createblog')
      }} type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">New</button>
      </div>
      <div className="mb-3 "><Avatar name="Abhishek" w={40}  h={40}  /></div>
      
      </div>

    </div>
  )
}

export default Appbar