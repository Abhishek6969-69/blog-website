import { Link } from "react-router-dom";
import Appbar from "../components/Appbar"
import { Blogcard } from "../components/Blogcards"
import { useBlogs } from "../components/hooks"
import Shimmer from "../components/shimmer";

function Blogs() {
    const {loading,blog}=useBlogs();
    if(!loading){
        <div><Shimmer /></div>
    }
   
  return (
    <div >
        <div className=" w-full">
        <Appbar />
        </div>
    
    
        <div className="flex justify-center   ">
        <div className=" p-4   ">
           
                {
                loading==true?<div className=" w-full  "><Shimmer/></div> :blog.map((b)=>
                <Link to={`/blog/${b.id}`} >
                    <div className=" mr-60 mt-5 mb-2">
                    <Blogcard  authorname={b.author.name} publisheddate={b.
publishdate}
                    title={b.title} 
                    content={b.content} 
                    imageurl={b.imageurl} />
                    </div>
                    </Link>
                    )
                }
      
       

     

      
        </div>
        
        </div>
    </div>
  )
}

export default Blogs