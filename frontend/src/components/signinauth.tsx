import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./config";
import { Link, useNavigate } from "react-router-dom";
import { SigninInput } from "@abhishekyaduvanshi/common";
import { toast } from "sonner";

function Signinauth() {
  const navigate = useNavigate();
  const [postInput, setPostInput] = useState<SigninInput>({
    email: "",
    password: "",
  });

  async function sendRequest() {
    const toastId = toast.loading("Processing sign-in...", {
      style: { background: "#e0e0e0", color: "#333" }, // Custom gray for loading
    });
    try {
      console.log("Sending sign-in request:", { url: `${BACKEND_URL}/api/v1/user/signin`, payload: postInput });
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInput);
      toast.dismiss(toastId);
      toast.success("Signed in successfully!", {
        style: { background: "#4caf50", color: "#fff" }, // Custom green for success
      });
      const token = response.data.jwt;
      localStorage.setItem("token", `Bearer ${token}`);
      console.log("Sign-in response:", response.data);
      const userRes = await axios.get(`${BACKEND_URL}/api/v1/user/getloggedinuser`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      localStorage.setItem("user", JSON.stringify(userRes.data.users));
      console.log("User info response:", userRes.data);
      navigate("/landingpage");
    } catch (error: unknown) {
      toast.dismiss(toastId);
      if (axios.isAxiosError(error)) {
        console.error("Sign-in error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(
          error.response?.data?.message || "Sign-in failed. Please check your credentials.",
          {
            style: { background: "#f44336", color: "#fff" }, // Custom red for error
          }
        );
      } else {
        console.error("Sign-in error:", error);
        toast.error("Sign-in failed. Please check your credentials.", {
          style: { background: "#f44336", color: "#fff" },
        });
      }
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Write Wave</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <Inputbox
          label="Email address"
          placeholder="Enter your email"
          type="email"
          onChange={(e) =>
            setPostInput({
              ...postInput,
              email: e.target.value,
            })
          }
        />
        <Inputbox
          label="Password"
          placeholder="Enter your password"
          type="password"
          onChange={(e) =>
            setPostInput({
              ...postInput,
              password: e.target.value,
            })
          }
        />
        
        {/* Primary Button */}
        <button
          type="button"
          onClick={sendRequest}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sign in
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
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
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        id={label.toLowerCase().replace(/\s+/g, '')}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Signinauth;