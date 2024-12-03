import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {SigninInput, createBlog} from "@abhishekyaduvanshi/common"
import { verify } from "hono/jwt";
import { stringify } from "querystring";
// import {SignpuInput} from "@abhishekyaduvanshi/common"
import { CreateBlog,updateBlog } from "@abhishekyaduvanshi/common";
import { number, string } from "zod";
export const blogrouter=new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_TOKEN:string;
  },
  Variables : {
		userId: number
	}
}>();
blogrouter.use('/*',async(c, next)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  
  const authheader=c.req.header('Authorization');
  const token=authheader?.split(' ')[1] || " ";
  const decodedval=await verify(token,c.env.JWT_TOKEN);
  if(decodedval){
  // @ts-ignore
   c.set('userId',decodedval.id )
    await next();
  }
  else{
    c.status(403)
    return c.json("Unauthorized")
  }
})
blogrouter.post('/', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try{
  const body=await c.req.json();
  const {success}=createBlog.safeParse(body);
      if(!success){
        c.status(403);
        return c.json("invalid");
      }
   
  const userId=c.get('userId');
  const blog=await prisma.post.create({
    data:{
      title:body.title,
      content:body.content,
      imageurl:body.imageurl,
      
     authorid:Number(userId ) 

    }
   
  });
  return c.json({
    id:blog.id
  })
} catch(e){
  c.status(403);
  return c.json({
    message:"error"
  })
}
    
  })
  
  blogrouter.put('/', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    try{
      const userId=c.get('userId');
     
      const body=await c.req.json();
      const {success}=updateBlog.safeParse(body);
          if(!success){
            c.status(403);
            return c.json("invalid");
          }
      const post=await prisma.post.update({
        where:{
          id:body.id,
          authorid:(userId) 
        },
        data:{
       title:body.title,
       content:body.content,
       imageurl:body.imageurl
        }
      })
        return c.json({message:"succesfully updated"})
    }
    catch{
      c.status(403);
      return c.json({
        message:"error"
      })
    }
   
  })
  blogrouter.post('/delete',async (c) => {
   
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    try{



await prisma.post.deleteMany({});
  

return c.json("deleted succesfully" )
    }
    catch(e){
      c.status(403);
      return c.json({
        message:"error"
      })
    }
   
  })
  blogrouter.get('/bulk',async (c) => {
   
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    try{


const post=await prisma.post.findMany({
  select:{
title:true,
content:true,
id:true,
imageurl:true,
publishdate:true,
author:{
  select:{
name:true
  }
}
  }
});
  
if(!post){
  return c.json("invalid")
}
return c.json({post} )
    }
    catch(e){
      c.status(403);
      return c.json({
        message:"error"
      })
    }
   
  })
  
  blogrouter.get('/:id',async (c) => {
    const idstring = c.req.param('id');
   
   const id=parseInt(idstring);
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    try{


const post=await prisma.post.findUnique({
  where:{
   id
  },
  select:{
    title:true,
    content:true,
    id:true,
    publishdate:true,
    imageurl:true,
    author:{
      select:{
    name:true
      }
    }
      }
})
if(!post){
  return c.json("invalid")
}
return c.json({post} )
    }
    catch(e:any){
      c.status(403);
      return c.json({
        message:"error",
        details: e.message 
      })
    }
   
  })
 