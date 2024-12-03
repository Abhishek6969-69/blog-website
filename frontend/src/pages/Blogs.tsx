import { Link } from "react-router-dom";
import Appbar from "../components/Appbar";
import { Blogcard } from "../components/Blogcards";
import { useBlogs } from "../components/hooks";
import Shimmer from "../components/shimmer";
import dayjs from "dayjs";
function Blogs() {
  const { loading, blog } = useBlogs();
  if (!loading) {
    <div>
      <Shimmer />
    </div>;
  }

  return (
    <div>
      <div className=" w-full  ">
        <Appbar />
      </div>

      <div className="flex justify-center   ">
        <div className=" p-4   ">
          {loading == true ? (
            <div className=" w-full  ">
              <Shimmer />
            </div>
          ) : (
            blog.map((b) => (
              <Link to={`/blog/${b.id}`} key={b.id}>
                <div className=" mr-80 mt-5 mb-2">
                  <Blogcard
                    authorname={b.author.name}
                    publisheddate={dayjs(b.publishdate).format('YYYY-MM-DD')}
                    key={b.id}
                    title={b.title}
                    content={b.content}
                    imageurl={b.imageurl}
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;
