interface BlogCardData {
  authorname: string;
  publisheddate: string;
  title: string;
  content: string;
  imageurl: string;
}

// Helper function to strip HTML tags from content
const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BlogCard = ({
  authorname,
  publisheddate,
  title,
  content,
  imageurl,
}: BlogCardData) => {
  // Clean and slice content for preview
  const cleanContent = stripHtml(content).slice(0, 150) + "...";

  return (
    <div className="mb-10 w-full max-w-4xl mx-auto">
      {/* Main container */}
      <div className="flex flex-col bg-gray-50 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-100/50 border border-gray-200 transition-all duration-300">
        {/* Blog image - Full width */}
        <div className="w-full rounded-2xl overflow-hidden">
          <img
            className="w-full h-56 md:h-72 object-cover rounded-2xl transform hover:scale-110 transition-transform duration-500 ease-out"
            src={imageurl}
            alt={title}
          />
        </div>

        {/* Text content - Below image */}
        <div className="flex-1 flex flex-col justify-between py-4">
          {/* Blog Title */}
          <div className="text-xl md:text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors duration-200 leading-tight">
            {title}
          </div>

          {/* Blog Content Preview */}
          <div className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed font-medium line-clamp-3">
            {cleanContent}
          </div>

          {/* Author details and read time */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={authorname} w={48} h={48} />
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{authorname}</span> • {publisheddate}
              </div>
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {`${Math.ceil(content.length / 100)} min read`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Avatar = ({
  name,
  w,
  h,
}: {
  name: string;
  w: number;
  h: number;
}) => {
  return (
    <div>
      <div
        className="relative inline-flex items-center justify-center overflow-hidden bg-black rounded-full shadow-md ring-2 ring-white"
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <span className="text-sm md:text-base uppercase text-white font-bold tracking-wide">
          {name[0].toUpperCase() + (name[1]?.toUpperCase() || "")}
        </span>
      </div>
    </div>
  );
};

export default BlogCard;