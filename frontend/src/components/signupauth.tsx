import { useState } from "react";
import axios from "axios";
import { SignupInput } from "@abhishekyaduvanshi/common";
import { BACKEND_URL } from "./config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Signupauth() {
  const [postInput, setPostInput] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function sendRequest() {
    const toastId = toast.loading("Processing sign-up...", {
      style: { background: "#e0e0e0", color: "#333" }, // Custom gray for loading
    });
    try {
      console.log("Sending sign-up request:", { url: `${BACKEND_URL}/api/v1/user/signup`, payload: postInput });
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInput);
      const token = response.data.jwt;
      localStorage.setItem("token", `Bearer ${token}`);
      console.log("Sign-up response:", response.data);

      // Fetch user info
      console.log("Fetching logged-in user:", { url: `${BACKEND_URL}/api/v1/user/getloggedinuser` });
      const userRes = await axios.get(`${BACKEND_URL}/api/v1/user/getloggedinuser`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      localStorage.setItem("user", JSON.stringify(userRes.data.users));
      console.log("User info response:", userRes.data);

      toast.dismiss(toastId);
      toast.success("Signed up successfully!", {
        style: { background: "#4caf50", color: "#fff" }, // Custom green for success
      });
      navigate("/landingpage");
    } catch (error: unknown) {
      toast.dismiss(toastId);
      if (axios.isAxiosError(error)) {
        console.error("Sign-up error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(
          error.response?.data?.message || "Sign-up failed. Please check your inputs.",
          {
            style: { background: "#f44336", color: "#fff" }, // Custom red for error
          }
        );
      } else {
        console.error("Sign-up error:", error);
        toast.error("Sign-up failed. Please try again.", {
          style: { background: "#f44336", color: "#fff" },
        });
      }
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="">
        <h1 className="text-3xl font-bold text-center">Create an Account</h1>
        <h3 className="text-slate-600 mx-[20px] text-center mt-2">
          <Link to="/signin">Already have an account? Login</Link>
        </h3>
        <Inputbox
          label="Name"
          placeholder="Name"
          type="text"
          onChange={(e) => setPostInput({ ...postInput, name: e.target.value })}
        />
        <Inputbox
          label="Email"
          placeholder="Email"
          type="email"
          onChange={(e) => setPostInput({ ...postInput, email: e.target.value })}
        />
        <Inputbox
          label="Password"
          placeholder="Password"
          type="password"
          onChange={(e) => setPostInput({ ...postInput, password: e.target.value })}
        />
        <button
          type="button"
          onClick={sendRequest}
          className="mt-6 w-full hover:bg-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 border bg-white"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  placeholder: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Inputbox = ({ placeholder, type, label, onChange }: InputProps) => {
  return (
    <div className="mt-3">
      <label className="block mb-1 text-sm font-medium text-gray-900">{label}</label>
      <input
        type={type}
        id={label.toLowerCase()}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Signupauth;