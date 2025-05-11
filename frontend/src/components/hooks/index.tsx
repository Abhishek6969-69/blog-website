import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
import Shimmer from "../shimmer";
import { useParams } from "react-router-dom";



 export type Blog={
           title: string ,
            content: string ,
            id: number ,
            data?:unknown,
            imageurl:string,
            publishdate: string ,
            author: {
                name: string 
            },
          
}

export const useEachblog=({id}:{id:string})=>{
    // const {id}=useParams<{id:string}>();
   
    const [loading,setloading]=useState(true);
const[blogs2,setblogs2]=useState<Blog >();
if(!loading){
    <div>
        <Shimmer />
    </div>
}
useEffect(()=>{
    const fetchdata=async()=>{
        const token1= localStorage.getItem('token')
      
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization:  token1 ,
            },
        });
     
      setblogs2(response.data.post)
      setloading(false)
    }
  
    fetchdata()
},[id])
return{
    loading,
    blogs2
}
}
 export const useBlogs=()=>{
const [loading,setloading]=useState(true);
const[blog,setblog]=useState<Blog[]>([]);
if(!loading){
    <div>
        <Shimmer />
    </div>
}
useEffect(()=>{
    const fetchdata=async()=>{
        const token1= localStorage.getItem('token')
       
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: token1 ,
            },
        });
    
      setblog(response.data.post)
      setloading(false)
    }
  
    fetchdata()
},[])
return{
    loading,
    blog
}
}