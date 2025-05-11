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
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <h3 className="text-slate-600 text-center mt-2">
          <Link to="/signup">Don't have an account? Sign up</Link>
        </h3>

        <Inputbox
          label="Email"
          placeholder="Email"
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
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setPostInput({
              ...postInput,
              password: e.target.value,
            })
          }
        />
        <button
          type="button"
          onClick={sendRequest}
          className="mt-6 w-full hover:bg-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 border bg-white"
        >
          Sign in
        </button>
        {/* <button
          type="button"
          onClick={() =>
            toast.info("Test toast working!", {
              style: { background: "#2196f3", color: "#fff" }, // Custom blue for info
            })
          }
          className="mt-2 w-full hover:bg-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 border bg-gray-100"
        >
          Test Toast
        </button> */}
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

export default Signinauth;