import { Link, useNavigate } from "react-router-dom";
import Appbar from "../components/Appbar";
import  BlogCard  from "../components/Blogcards";
import { useBlogs } from "../components/hooks";
import Shimmer from "../components/shimmer";
import dayjs from "dayjs";

function Blogs() {
  const { loading, blog } = useBlogs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Appbar />
      
      {/* Simple Header Section */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              All Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing content from our community of writers.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="w-full">
              <Shimmer />
            </div>
          ) : blog.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-12 border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">No Stories Yet</h2>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Be the first to share your thoughts and insights with our growing community of readers and writers!
                </p>
                <button
                  onClick={() => navigate("/createblog")}
                  className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg"
                >
                  Write Your First Story
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Latest Stories from Our
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Community</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover fresh perspectives and insights from writers around the world.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {blog.map((b) => (
                  <Link
                    to={`/blog/${b.id}`}
                    key={b.id}
                    className="block transform hover:scale-[1.02] transition-all duration-500"
                  >
                    <BlogCard
                      authorname={b.author.name}
                      publisheddate={dayjs(b.publishdate).format("MMM DD, YYYY")}
                      title={b.title}
                      content={b.content}
                      imageurl={b.imageurl}
                    />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Blogs;