import { Route, Routes, useNavigate ,useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Blogs from './pages/Blogs';
import { Toaster } from 'sonner';
import Blogcontent from './components/Blogcontent';
import { Createblog } from './pages/Createblog';
import Landingpg from './pages/Landingpg';
// import { DropdownMenuCheckboxes } from './components/ui/dropdown-menu';
// import { Toaster } from './components/ui/toaster';
import ProfilePage from './pages/Profile';

function App() {
 
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Only redirect if user tries to access protected pages
    const publicPaths = ['/signup', '/signin'];
  
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/signup');
    }
  }, [navigate, location.pathname]);

  return (
    <>
     <Toaster  />
    <Routes>
       <Route path="/" element={<Landingpg />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/blog/:id" element={<Blogcontent />} />
     
      <Route path="/createblog" element={<Createblog />} />
      <Route path="/landingpage" element={<Blogs />} />
      <Route path="/profile" element={<ProfilePage />} />
     
    </Routes>
   
    </>
  );
}

export default App;
