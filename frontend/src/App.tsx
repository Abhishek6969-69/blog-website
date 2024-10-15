import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Blogs from './pages/Blogs';
import Blogcontent from './components/Blogcontent';
import { Createblog } from './pages/Createblog';

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
       <Route path="/" element={<Blogs />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/blog/:id" element={<Blogcontent />} />
     
      <Route path="/createblog" element={<Createblog />} />
    </Routes>
  );
}

export default App;
