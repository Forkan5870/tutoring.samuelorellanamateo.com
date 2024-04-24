import "./index.css";
import StudentPortal from './pages/StudentPortal';
import CreateStudent from './pages/CreateStudent';
import NotFoundPage from './pages/NotFoundPage';
import StudentList from './pages/StudentList';
import Loading from './components/Loading';

import { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Redirect } from "react-router-dom";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/loading" element={<Loading />} />
          <Route path="/create" element={<CreateStudent />} />
          <Route path="/list" element={<StudentList />} />
          <Route path="/portal/:studentId" element={<StudentPortal />} />
          <Route path="/reddit" element={<RedirectToReddit />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
};

const RedirectToReddit = () => {
  useEffect(() => {
    window.location.href = 'https://www.reddit.com/r/ibtutors/comments/16mz9is/comment/kv15kof/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button';
  }, []);

  return null;
};


export default App;
