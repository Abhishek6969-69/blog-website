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
    <div className="min-h-screen bg-white">
      <Appbar />
      
      

      {/* Content Section */}
      <section className="py-4 lg:py-6">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          {loading ? (
            <div className="w-full">
              <Shimmer />
            </div>
          ) : blog.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white border border-gray-200 rounded-xl p-12">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">No Stories Yet</h2>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                  Be the first to share your thoughts and insights with our growing community of readers and writers!
                </p>
                <button
                  onClick={() => navigate("/createblog")}
                  className="px-12 py-6 bg-black hover:bg-gray-800 text-white font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-lg"
                >
                  Write Your First Story
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Latest Stories from Our Community
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                  Discover fresh perspectives and insights from writers around the world.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {blog.map((b) => (
                  <Link
                    to={`/blog/${b.id}`}
                    key={b.id}
                    className="block transition-all duration-200 hover:shadow-md"
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