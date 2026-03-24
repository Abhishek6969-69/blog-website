
import Appbar from '../components/Appbar';
import BlogEditor from '../components/Texteditor';


export const Createblog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Appbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">Share your thoughts and knowledge with the world</p>
        </div> */}
        
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
          <BlogEditor />
        </div>
      </div>
    </div>
  );
};