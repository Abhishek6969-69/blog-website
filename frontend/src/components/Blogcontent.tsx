import { useEachblog } from "./hooks";
import { ReactNode, useEffect, useState } from "react";
import { Avatar } from "./Blogcards";
import Appbar from "./Appbar";
import Shimmer from "./shimmer";
import dayjs from "dayjs";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { BACKEND_URL } from "./config";

function Blogcontent(): ReactNode {
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const { blogs2 } = useEachblog({ id: id || "" });

  const [content2, setContent] = useState<string>("");

  // Debug author data
  useEffect(() => {
    if (blogs2) {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("Author data:", {
        blogAuthor: blogs2.author,
        loggedInUser,
        blogId: id,
      });
      setContent(blogs2.content); // Set the HTML content
    }
  }, [blogs2, id]);

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting blog post...", {
      style: { background: "#e0e0e0", color: "#333" }, // Custom gray for loading
    });

    try {
      const token = localStorage.getItem("token");
      console.log("Deleting blog:", {
        url: `${BACKEND_URL}/api/v1/blog/${id}`,
        token,
      });

      if (!token) {
        toast.dismiss(toastId);
        toast.error("You must be logged in to delete a post", {
          style: { background: "#f44336", color: "#fff" }, // Custom red for error
        });
        navigate("/signin");
        return;
      }

      const response = await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      console.log("Blog deleted successfully:", response.data);
      toast.dismiss(toastId);
      toast.success("Your blog has been deleted successfully", {
        style: { background: "#4caf50", color: "#fff" }, // Custom green for success
      });
      navigate("/landingpage");
    } catch (error: unknown) {
      console.error("Delete error:", error);
      toast.dismiss(toastId);
      if (axios.isAxiosError(error)) {
        console.log("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to delete blog post. Please try again.",
          {
            style: { background: "#f44336", color: "#fff" },
          }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          style: { background: "#f44336", color: "#fff" },
        });
      }
    }
  };

  // Check if blogs2 is available
  if (!blogs2) {
    return (
      <div>
        <Shimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="flex flex-col md:flex-row ml-4">
        {/* Main Content Section */}
        <div className="flex justify-center w-full md:w-2/3 mt-16 lg:w-3/5 mx-4 no-scrollbar overflow-y-auto max-h-screen">
          <div className="w-full max-w-3xl mx-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold capitalize">{blogs2.title}</h1>
              <div className="mt-2 shadow-sm flex justify-between">
                <h2 className="inline text-lg text-gray-600 capitalize">
                  {dayjs(blogs2.publishdate).format('dddd, D[th] MMMM, YYYY')}
                </h2>
                <div>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete blog post"
                  >
                    <MdDelete size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-center">
                {/* Image can be enabled if needed */}
                {/* <img src={blogs2.imageurl} className="w-full max-w-lg font-serif" alt={blogs2.title} /> */}
              </div>
              <div className="mt-10 text-lg leading-relaxed font-serif">
                <div dangerouslySetInnerHTML={{ __html: content2 }} />
                {/* Render HTML content */}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Blog Post Author Info */}
        <div className="w-full md:w-[420px] lg:w-[350px] shadow-2xl mt-10 md:mt-0 ml-10 md:ml-28">
          <div className="ml-6">
            <h3 className="text-xl font-semibold mt-8">About the Author</h3>
            <div className="flex items-center mt-4">
              <Avatar name={blogs2.author.name} w={35} h={35} />
              <h4 className="text-lg font-semibold capitalize ml-2">{blogs2.author.name}</h4>
            </div>
            <div className="mt-4 text-sm text-gray-800">
              <p>
                Written by {blogs2.author.name} on{' '}
                {dayjs(blogs2.publishdate).format('D[th] MMMM, YYYY')}.
              </p>
              <p className="mt-2">
                This post is {Math.ceil(blogs2.content.length / 100)} minute(s) read.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogcontent;