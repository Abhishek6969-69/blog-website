import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Blogs from './pages/Blogs';
import Blogcontent from './components/Blogcontent';
import { Createblog } from './pages/Createblog';
import Landingpg from './pages/Landingpg';
// import { DropdownMenuCheckboxes } from './components/ui/dropdown-menu';

import ProfilePage from './pages/Profile';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/signup');
    }
  }, [navigate]);

  return (
    <Routes>
       <Route path="/" element={<Landingpg />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/blog/:id" element={<Blogcontent />} />
     
      <Route path="/createblog" element={<Createblog />} />
      <Route path="/landingpage" element={<Blogs />} />
      <Route path="/profile" element={<ProfilePage />} />
     
    </Routes>
  );
}

export default App;
