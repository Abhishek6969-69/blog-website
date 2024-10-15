import { useEachblog } from "./hooks";
import { ReactNode } from "react"; //
import { Avatar } from "./Blogcards";

import Appbar from "./Appbar";

function Blogcontent(): ReactNode {
  const {  blogs2 } = useEachblog();
  console.log(blogs2, "yess");
  //  if(!loading){
  //   return<div>
  //     .......loading
  //   </div>
  //  }
  if (!blogs2) {
    return;
  }
  return (
    <div>
      <div><Appbar /></div>
   <div className=" flex justify-center  mt-28 ">
      <div className="">
        <div className=" flex justify-center ">
        <h1 className="  text-5xl font -bold capitalize w-1/2 ml-16 ">{blogs2.title}</h1>
        </div>
        <div className=" flex justify-center ">
          <div className=" mt-6">
            <Avatar name={blogs2.author.name} w={35} h={35}  />
          </div>
          <div className=" mt-4 ml-4">
            <h3>{blogs2.author.name} </h3>
            <div className=" inline">
              {`${Math.ceil(blogs2.content.length / 100)} minute(s) read`}
              <h4 className=" inline ml-4"> {blogs2.publishdate}</h4>
            </div>
          </div>
        </div>
        <div className="  w-1/2  m-auto">
        <div className="  400px  flex justify-center mt-10">
        <img src={blogs2?.
imageurl} className="w-[550px]" />
      </div>
        <div className=" flex align-middle justify-center mt-10">
        {blogs2.content}
      </div>
      </div>
      </div>
     
      
    </div>
    </div>
  );
}

export default Blogcontent;
