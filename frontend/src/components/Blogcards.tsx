interface BlogCardData {
  authorname: string;
  publisheddate: string;
  title: string;
  content: string;
  imageurl: string;
}

export const Blogcard = ({ authorname, publisheddate, title, content, imageurl }: BlogCardData) => {
  return (
    <div className="mb-6 w-full ml-28 md:ml-0 md:max-w-7xl mx-auto">
      {/* Main container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Text content */}
        <div className="flex-1">
          {/* Author details */}
          <div className="flex items-center gap-4">
            <Avatar name={authorname} w={40} h={40} />
            <div className="text-sm text-gray-600">
              {authorname} • {publisheddate}
            </div>
          </div>

          {/* Blog Title */}
          <div className="text-xl md:text-2xl font-bold mt-3">{title}</div>

          {/* Blog Content Preview */}
          <div
            className="mt-2 text-sm md:text-base leading-relaxed font-serif text-gray-700"
            dangerouslySetInnerHTML={{ __html: content.slice(0, 100) + "..." }}
          />

          {/* Read time */}
          <div className="mt-1 text-xs md:text-sm text-gray-500">
            {`${Math.ceil(content.length / 100)} minute(s) read`}
          </div>
        </div>

        {/* Blog image */}
        <div className="w-full md:w-auto max-w-[150px] md:max-w-[200px] flex-shrink-0">
          <img
            className="w-full h-auto rounded-lg object-cover"
            src={imageurl}
            alt={title}
          />
        </div>
      </div>
    </div>
  );
};

export const Avatar = ({ name, w, h }: { name: string; w: number; h: number }) => {
  return (
    <div>
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-300 rounded-full`}
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <span className="text-xs md:text-sm uppercase text-black font-semibold">
          {name[0].toUpperCase() + (name[1]?.toUpperCase() || "")}
        </span>
      </div>
    </div>
  );
};
