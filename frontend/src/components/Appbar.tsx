
import { Avatar } from "./Blogcards"
import { Link, useNavigate } from "react-router-dom"
import { useAppSelector} from "./utils/hook";
import { selectLoggedIn, selectUsers } from "./utils/slice1";
import { useState ,useEffect} from "react";
function Appbar() {
  const navigate=useNavigate();
  const [username,setUsername]=useState('Abhishek')
 const [userlog,setuserlog]=useState(false)
  const users = useAppSelector(selectUsers);
  const loggedinornot=useAppSelector(selectLoggedIn);
  useEffect(() => {
    if (users.length > 0) {
      setUsername(users[0].name);
    }
  }, [users]);
useEffect(()=>{
  setuserlog(loggedinornot);
},[loggedinornot])
  
 if(!userlog){
  navigate('/signup')
 }
  
  return (
    <div className=" flex justify-between p-3  border-b-2  ">
      <div className=" ">
        <Link to={'/'}>Medium</Link></div>
      <div className=" flex items-center gap-10">
      <div>
        {
        !userlog?<button onClick={()=>{
          navigate('/signup')
        }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Signup</button>:
      <button onClick={()=>{
        navigate('/createblog')
      }} type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">New</button>
    }</div>
      <div className="mb-3 "><Avatar name={username} w={40}  h={40}  /></div>
      
      </div>

    </div>
  )
}

export default Appbar