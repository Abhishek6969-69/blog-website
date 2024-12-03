import axios from 'axios';
import { SignupInput } from "@abhishekyaduvanshi/common";
import { BACKEND_URL } from "./config";
import { Link, useNavigate } from "react-router-dom";
import {  useState } from 'react';
// import Secondarybtn from '../pages/Secondarybtn';

function Signupauth() {

  const [postinput, setpostinput] = useState<SignupInput>({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  async function sendrequest() {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postinput);
      const token = response.data.jwt;
     
      localStorage.setItem('token', 'Bearer ' + token);

      // Call to get user info after signup
      const userRes = await axios.get(`${BACKEND_URL}/api/v1/user/getloggedinuser`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
    
localStorage.setItem('user',JSON.stringify(userRes.data.users))

      
      navigate('/landingpage');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <h3 className="text-slate-600 mx-[20px]"><Link to={'/signin'}>Already Have an account? Login</Link></h3>
        <Inputbox label="Name" placeholder={"Name"} type="text" onchange={(e) => setpostinput({ ...postinput, name: e.target.value })} />
        <Inputbox label="Email" placeholder={"Email"} type="email" onchange={(e) => setpostinput({ ...postinput, email: e.target.value })} />
        <Inputbox label="Password" placeholder={"Password"} type="password" onchange={(e) => setpostinput({ ...postinput, password: e.target.value })} />
        <button type="button" onClick={sendrequest} className=" mt-6 w-full  hover:bg-slate-200  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 border bg-white">Signup</button>
      
      </div>
    </div>
  )
}

interface InputProps {
  label: string;
  placeholder: string;
  type: string;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Inputbox = ({ placeholder, type, label, onchange }: InputProps) => {
  return (
    <div className="mt-3">
      <label className="block mb-1 text-sm font-medium text-gray-900">{label}</label>
      <input type={type} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required onChange={onchange} />
    </div>
  )
}

export default Signupauth;
