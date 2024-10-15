interface blogcarddata{
    authorname:string,
    publisheddate:string,
    title:string,
    content:string,
    imageurl:string
}
export const Blogcard=({authorname,publisheddate,title,content,imageurl}:blogcarddata)=>{
return (
    <div className=" ml-32 w-full">
    <div className=" w-full flex justify-between">
        <div>
        <div className="flex  items-center gap-4 ">
            <div>
            <Avatar name={authorname } w={25} h={25} /> 
            </div>
           <div className=" font-thin text-slate-600 ">
           {authorname} .{publisheddate}
           </div>
        
        </div>
        <div className="text-xl font-bold ">
            {title}
        </div>
        <div>
            {content.slice(0,100) +"..."}
        </div>
        <div>
          {  `${Math.ceil(content.length/100)} minute(s) read`}
        </div>
        </div>
        <div>
            <img className=" w-36" src={imageurl}/>
            
        </div>
    </div>
    </div>
)
}
 export const Avatar=({name,w,h}:{name:string,w:number,h:number})=>{
    return(
        <div>

<div className={`relative  inline-flex items-center justify-center  overflow-hidden bg-[#a06cd5] rounded-full `} style={{ width: `${w}px`, height: `${h}px` }}>
    <span className="   text-xs text-gray-300 dark:text-gray-300  uppercase">{name[0]+name[1]}</span>
</div>

        </div>
        
    )
}