import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./config";
import { Link, useNavigate } from "react-router-dom";
import { SigninInput } from "@abhishekyaduvanshi/common";


 function Signinauth() {
    const navigate=useNavigate();
    const[postinput,setpostinput]=useState<SigninInput> ({
       
        email:"",
        password:""
    })
  
    async function sendrequest(){
        const response=await  axios.post(`${BACKEND_URL}/api/v1/user/signin`,
              postinput
          )
          const token=response.data.jwt;
          localStorage.setItem('token','Bearer '+token)
         
           navigate('/');
         }
  return (
    <div className="h-screen flex justify-center items-center">
        <div className="">
           <h1 className=" text-3xl font-bold text-center  ">Login</h1>
           <h3 className="  text-slate-600 mx-[20px]"><Link to={'/signup'}>Don't have Account? signup</Link></h3>
          
           <Inputbox label="Email" placeholder={"Email"} type="email"  onchange={(e)=>{
setpostinput({
    ...postinput,
    email:e.target.value
})
           }}/>
           <Inputbox label="Password" placeholder={"password"} type="password"  onchange={(e)=>{
setpostinput({
    ...postinput,
    password:e.target.value
})
           }}/>
           <button type="button" onClick={sendrequest} className="text-white mt-6 w-full  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Signup</button>
      
        </div>
  
    </div>
  )
}

interface inputprops{
    label:string,
placeholder:string,
type:string,
onchange?:(e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Inputbox=({placeholder,type,label,onchange}:inputprops)=>{
    return(
        <div className=" mt-3">
        <label  className="block mb-1 text-sm font-medium text-gray-900">{label}</label>
        <input type={type} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required onChange={onchange} />
    </div>
    )
   
}
export default  Signinauth