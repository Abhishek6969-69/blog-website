import { useEachblog } from "./hooks";
import { ReactNode } from "react";
import { Avatar } from "./Blogcards";
import Appbar from "./Appbar";
import Shimmer from "./shimmer";

function Blogcontent(): ReactNode {
  const { blogs2 } = useEachblog();

  // Check if blogs2 is available
  if (!blogs2) {
    return <div><Shimmer /></div>; // You can adjust this message as needed
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center mt-10 md:mt-28">
        <div className="w-full max-w-3xl mx-4">
          <div className="flex justify-center">
            <h1 className="text-3xl md:text-5xl font-bold capitalize w-full text-center">
              {blogs2.title}
            </h1>
          </div>
          <div className="flex justify-center items-center mt-6">
            <Avatar name={blogs2.author.name} w={35} h={35} />
            <div className="ml-4 text-center">
              <h3 className="text-lg font-semibold">{blogs2.author.name}</h3>
              <div className="inline">
                {`${Math.ceil(blogs2.content.length / 100)} minute(s) read`}
                <h4 className="inline ml-4 text-sm">{blogs2.publishdate}</h4>
              </div>
            </div>
          </div>
          <div className="mt-10 w-full">
            <div className="flex justify-center">
              <img src={blogs2.imageurl} className="w-full max-w-lg font-serif" alt={blogs2.title} />
            </div>
            <div className="mt-10 text-lg leading-relaxed font-serif">
              <p>{blogs2.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogcontent;
