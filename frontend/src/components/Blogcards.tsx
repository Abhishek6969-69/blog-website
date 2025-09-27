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

// Helper function to extract the first image from HTML content
const extractFirstImage = (html: string): string | null => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const img = tmp.querySelector("img");
  return img ? img.src : null;
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
  
  // Get the first image from content, fallback to imageurl, then to a default
  const firstImageFromContent = extractFirstImage(content);
  const displayImage = firstImageFromContent || 
    (imageurl !== 'https://via.placeholder.com/150' ? imageurl : null) ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop';

  return (
    <div className="group h-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Blog image */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            className="w-full h-48 md:h-56 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            src={displayImage}
            alt={title}
            onError={(e) => {
              // Fallback to a nice default image if the image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={authorname} w={32} h={32} />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{authorname}</p>
              <p className="text-gray-500">{publisheddate}</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 leading-tight mb-3 line-clamp-2">
            {title}
          </h3>

          {/* Content preview */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
            {cleanContent}
          </p>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {`${Math.ceil(content.length / 100)} min read`}
            </span>
            <div className="flex items-center gap-1 text-indigo-600 group-hover:text-indigo-700 transition-colors">
              <span className="text-sm font-medium">Read more</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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
  const getGradientClass = () => {
    const gradients = [
      'bg-gradient-to-br from-indigo-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-indigo-600', 
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-green-500 to-blue-600',
      'bg-gradient-to-br from-yellow-500 to-orange-600'
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-md ring-2 ring-white/50 ${getGradientClass()}`}
      style={{ width: `${w}px`, height: `${h}px` }}
    >
      <span className="text-white font-bold tracking-wide" style={{ fontSize: `${w * 0.35}px` }}>
        {name[0]?.toUpperCase() || 'U'}{name[1]?.toUpperCase() || ''}
      </span>
    </div>
  );
};

export default BlogCard;