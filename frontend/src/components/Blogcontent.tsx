import { useEachblog } from "./hooks";
import { ReactNode, useEffect, useState } from "react";
import { Avatar } from "./Blogcards";
import Appbar from "./Appbar";
import Shimmer from "./shimmer";
import dayjs from "dayjs";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Store } from 'react-notifications-component';
import { BACKEND_URL } from "./config";
function Blogcontent(): ReactNode {
  const navigate=useNavigate();
  const { blogs2 } = useEachblog();
  const { id } = useParams(); 
  

  const [content2, setContent] = useState<string>("");

const Shownotification=async()=>{
  try{
    await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`,{
      headers: {
        Authorization: localStorage.getItem('token'),
      }
    })
    
    Store.addNotification({
      title: "Wonderful!",
      message: "Your blog has been deleted succesfully",
      type: "success",
      insert: "top",
      container: "bottom-left",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true
      }
    });
    
   navigate('/');
    
  }
  catch(e){
    
  }
 
}
  useEffect(() => {
    if (blogs2) {
      setContent(blogs2.content); // Set the HTML content once blogs2 is available
    }
  }, [blogs2]);

  // Check if blogs2 is available
  if (!blogs2) {
    return (
      <div>
        <Shimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="flex flex-col md:flex-row ml-4  ">
        {/* Main Content Section */}
        <div className="flex justify-center w-full md:w-2/3 mt-16 lg:w-3/5 mx-4 no-scrollbar overflow-y-auto max-h-screen">
          <div className="w-full max-w-3xl mx-4">
            <div className=" ">
              <h1 className="text-3xl md:text-5xl font-bold capitalize ">{blogs2.title}</h1>
            <div className=" mt-2 shadow-sm flex justify-between">  <h2 className="inline  text-lg text-gray-600   capitalize">
                {dayjs(blogs2.publishdate).format('dddd, D[th] MMMM, YYYY')}
              </h2>
              <div>
                <button type="submit" onClick={Shownotification}><MdDelete /></button>
              </div>
              </div>
             
            </div>

            <div className=" w-full">
              <div className="flex justify-center">
                {/* Image can be enabled if needed */}
                {/* <img src={blogs2.imageurl} className="w-full max-w-lg font-serif" alt={blogs2.title} /> */}
              </div>
              <div className="mt-10 text-lg leading-relaxed font-serif">
                <div dangerouslySetInnerHTML={{ __html: content2 }} />
                {/* Render HTML content */}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Author Info */}
        <div className="w-full md:w-[420px] lg:w-[350px] shadow-2xl mt-10 md:mt-0 ml-10 md:ml-28">
          <div className=" ml-6">
            <div className="flex  items-center mt-8">
              <Avatar name={blogs2.author.name} w={35} h={35} />
              <h3 className="text-lg font-semibold capitalize">{blogs2.author.name}</h3>
            </div>

            <div className="inline mt-8 text-sm text-gray-800">
              {`${Math.ceil(blogs2.content.length / 100)} minute(s) read`}
              <h4 className="inline ml-4 text-sm text-gray-800">
                {dayjs(blogs2.publishdate).format('dddd, D[th] MMMM, YYYY')}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogcontent;
