
import Appbar from '../components/Appbar';
import  BlogEditor from '../components/Texteditor'
import { Provider } from 'react-redux';

export const Createblog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="flex justify-center py-10">
        <div className="w-full max-w-4xl">
       
          <BlogEditor />
         
        </div>
      </div>
    </div>
  );
};