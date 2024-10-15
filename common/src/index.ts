import {z} from 'zod'

export const signininput=z.object({
    email:z.string().email(),
    password:z.string().min(6),
   
    
})
export const signupinput=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string(),
})
export const  createBlog=z.object({
    title:z.string(),
    content:z.string(),
    imageurl:z.string()
    
})
export const updateBlog=z.object({
id:z.string(),
title:z.string(),
content:z.string(),
imageurl:z.string()
})
export type SigninInput=z.infer<typeof signininput>
export type SignupInput=z.infer<typeof signupinput>

export type CreateBlog=z.infer<typeof createBlog>
export type UpdateBlog=z.infer<typeof updateBlog>