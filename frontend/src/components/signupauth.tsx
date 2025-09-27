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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
        <p className="text-gray-600">Join our community and start writing</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <Inputbox
          label="Full name"
          placeholder="Enter your full name"
          type="text"
          onChange={(e) => setPostInput({ ...postInput, name: e.target.value })}
        />
        <Inputbox
          label="Email address"
          placeholder="Enter your email"
          type="email"
          onChange={(e) => setPostInput({ ...postInput, email: e.target.value })}
        />
        <Inputbox
          label="Password"
          placeholder="Create a password"
          type="password"
          onChange={(e) => setPostInput({ ...postInput, password: e.target.value })}
        />
        
        {/* Primary Button */}
        <button
          type="button"
          onClick={sendRequest}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create account
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/signin" 
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Sign in
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

export default Signupauth;