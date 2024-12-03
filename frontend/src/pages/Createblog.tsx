


import Appbar from "../components/Appbar";
import TextEditor from "../components/Texteditor"; 

export const Createblog = () => {
  

  return (
    <div>
     <div>
      <Appbar />
     </div>
      <div className="flex justify-center ">
       
      </div>
      <div className='flex justify-center mt-10 h-1/2'>
        <div className='w-1/2 h-3/4'>
             
          <TextEditor  />
        </div>
      </div>
    </div>
  );
};
