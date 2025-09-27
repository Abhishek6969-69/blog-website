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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Appbar />
      
      <style>
        {`
          .article-content img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 2em auto !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }
          
          .article-content p {
            margin: 1.5em 0 !important;
            line-height: 1.8 !important;
          }
          
          .article-content h1, 
          .article-content h2, 
          .article-content h3 {
            margin: 2em 0 1em 0 !important;
            font-weight: 600 !important;
          }
          
          .article-content blockquote {
            border-left: 4px solid #4f46e5 !important;
            background: #f8fafc !important;
            margin: 1.5em 0 !important;
            padding: 1em 1.5em !important;
            border-radius: 0 8px 8px 0 !important;
            font-style: italic !important;
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 border border-white/20">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Avatar name={blogs2.author.name} w={32} h={32} />
                    <div>
                      <p className="font-semibold text-gray-900">{blogs2.author.name}</p>
                      <p>{dayjs(blogs2.publishdate).format('MMM DD, YYYY')} • {Math.ceil(blogs2.content.length / 100)} min read</p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="group p-3 text-gray-400 hover:text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-200"
                    aria-label="Delete blog post"
                  >
                    <MdDelete size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {blogs2.title}
                </h1>
                
                {/* Featured Image - Only show if it's not a placeholder and there are no images in content */}
                {blogs2.imageurl && 
                 blogs2.imageurl !== 'https://via.placeholder.com/150' && 
                 !blogs2.content.includes('<img') && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img 
                      src={blogs2.imageurl} 
                      alt={blogs2.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-800 leading-relaxed article-content"
                  dangerouslySetInnerHTML={{ __html: content2 }} 
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={blogs2.author.name} w={48} h={48} />
                <div>
                  <h4 className="font-semibold text-gray-900">{blogs2.author.name}</h4>
                  <p className="text-sm text-gray-500">Writer</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Published on {dayjs(blogs2.publishdate).format('MMMM DD, YYYY')}
                </p>
                <p>
                  {Math.ceil(blogs2.content.length / 100)} minute read
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Show some love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogcontent;