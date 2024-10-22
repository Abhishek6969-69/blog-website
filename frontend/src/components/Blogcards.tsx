interface blogcarddata{
    authorname:string,
    publisheddate:string,
    title:string,
    content:string,
    imageurl:string
}
export const Blogcard=({authorname,publisheddate,title,content,imageurl}:blogcarddata)=>{
return (
    <div className="ml-20 mb-6 w-full max-w-3xl md:mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="flex-1 md:mr-4">
          <div className="flex items-center gap-4">
            <Avatar name={authorname} w={30} h={30} />
            <div className="font-thin text-slate-600">
              {authorname} . {publisheddate}
            </div>
          </div>
          <div className="text-xl font-bold mt-2">{title}</div>
          <div className="mt-2 font-serif">
            {content.slice(0, 100) + "..."}
          </div>
          <div className="mt-1">
            {`${Math.ceil(content.length / 100)} minute(s) read`}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <img className="w-full max-w-[150px] md:max-w-[150px]" src={imageurl} alt={title} />
        </div>
      </div>
    </div>
)
}
 export const Avatar=({name,w,h}:{name:string,w:number,h:number})=>{
    return(
        <div>

<div className={`relative  inline-flex items-center justify-center  overflow-hidden bg-[#a06cd5] rounded-full `} style={{ width: `${w}px`, height: `${h}px` }}>
    <span className="   text-xs text-gray-300 dark:text-gray-300  uppercase">{name[0] +name[1] }</span>
</div>

        </div>
        
    )
}