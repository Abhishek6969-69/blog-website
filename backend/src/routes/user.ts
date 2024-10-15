

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'
// @ts-ignore
import { signupinput,signininput } from '@abhishekyaduvanshi/common';
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_TOKEN: string;
	}
}>();
    userRouter.post('/signup',async (c) => {
      const body=await c.req.json();
      console.log('Request Body:', body);
      console.log(body)
      const {success}=signupinput.safeParse(body);
      if(!success){
        c.status(403);
        return c.json("invalid");
      }
        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try{
       
        console.log(body)
        const user=await prisma.user.create({
          data:{
            email:body.email,
            password:body.password,
            name:body.name
        
          },
        })
        const token=await sign({id:user.id},c.env.JWT_TOKEN)
        
          return c.json({
            jwt:token
          }) 
      }
      catch(e){
        console.log(e);
        c.status(411);
        return c.text("invalid");
      }
      
      })
      
      userRouter.post('/signin', async(c) => {
        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try{
        const body= await c.req.json();
        const {success}=signininput.safeParse(body);
      if(!success){
        c.status(403);
        return c.json("invalid");
      }
        const user=await prisma.user.findFirst({
          where:{
            email:body.email,
          }
        })
        if(!user){
          c.status(401);
          return c.json({error:"user not found"});
        }
        const token=await sign({id:user.id},c.env.JWT_TOKEN)
          return c.json({jwt:token})
      }
      catch(e){
        console.log(e);
        c.status(411);
        return c.text("invalid")
      }
      
      })
      



     