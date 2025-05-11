import { Link, useNavigate } from "react-router-dom";
import Appbar from "../components/Appbar";
import { Blogcard } from "../components/Blogcards";
import { useBlogs } from "../components/hooks";
import Shimmer from "../components/shimmer";
import dayjs from "dayjs";

function Blogs() {
  const { loading, blog } = useBlogs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Appbar */}
      <div className="w-full shadow-sm sticky top-0 z-50 bg-white">
        <Appbar />
      </div>

      {/* Blog Cards or Empty State */}
      <div className="flex justify-center py-10 px-4">
        <div className="max-w-5xl w-full">
          {loading ? (
            <div className="w-full">
              <Shimmer />
            </div>
          ) : blog.length === 0 ? (
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No PulsePosts Yet</h2>
              <p className="text-gray-600 mb-6">
                We have no blog posts. Create one to share your story!
              </p>
              <button
                onClick={() => navigate("/createblog")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blog.map((b) => (
                <Link
                  to={`/blog/${b.id}`}
                  key={b.id}
                  className="group transform hover:scale-[1.02] transition duration-300"
                >
                  <Blogcard
                    authorname={b.author.name}
                    publisheddate={dayjs(b.publishdate).format("YYYY-MM-DD")}
                    key={b.id}
                    title={b.title}
                    content={b.content}
                    imageurl={b.imageurl}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;