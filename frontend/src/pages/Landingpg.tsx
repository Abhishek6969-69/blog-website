
import { useNavigate } from "react-router-dom";
import Appbar from "../components/Appbar";
const Landingpg = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <Appbar />{" "}
      <div className="flex flex-col items-center justify-center  min-h-screen bg-white text-gray-800">
  <h1 className="text-5xl font-extrabold mb-4 text-center">
    Empower Your Knowledge Journey
  </h1>
  <p className="text-lg text-center max-w-2xl mb-8">
    Dive into a world of insightful articles, practical tutorials, and engaging stories designed to spark your curiosity and enhance your skills.
  </p>
  <div className="flex space-x-4">
    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition  "  onClick={() => {
            navigate("/signup");
          }}>
      Sign Up
    </button>
    <button className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"  onClick={() => {
            navigate("/signin");
          }}>
     Sign In
    </button>
  </div>
</div>


      
    </div>
  );
};

export default Landingpg;
