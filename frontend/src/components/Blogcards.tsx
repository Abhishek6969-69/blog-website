interface BlogCardData {
  authorname: string;
  publisheddate: string;
  title: string;
  content: string;
  imageurl: string;
}

export const Blogcard = ({
  authorname,
  publisheddate,
  title,
  content,
  imageurl,
}: BlogCardData) => {
  return (
    <div className="mb-8 w-full mx-auto ">
      {/* Main container */}
      <div className="flex flex-col md:flex-row gap-6 bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
        {/* Blog image */}
        <div className="w-full md:w-1/3 flex-shrink-0 rounded-2xl overflow-hidden">
          <img
            className="w-full h-48 md:h-56 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300"
            src={imageurl}
            alt={title}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Blog Title */}
          <div className="text-2xl md:text-3xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors duration-200 leading-snug">
            {title}
          </div>

          {/* Blog Content Preview */}
          <div
            className="mt-3 text-gray-600 text-base leading-relaxed font-sans line-clamp-3"
            dangerouslySetInnerHTML={{ __html: content.slice(0, 150) + "..." }}
          />

          {/* Author details and read time */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={authorname} w={44} h={44} />
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{authorname}</span> • {publisheddate}
              </div>
            </div>
            <div className="text-sm text-gray-400">
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
        className="relative inline-flex items-center justify-center overflow-hidden bg-black rounded-full shadow-sm "
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <span className="text-sm md:text-base uppercase text-white font-bold tracking-wide">
          {name[0].toUpperCase() + (name[1]?.toUpperCase() || "")}
        </span>
      </div>
    </div>
  );
};
