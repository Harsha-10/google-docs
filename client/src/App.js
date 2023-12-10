import Editor from './components/Editor';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to={`/docs/${uuid()}`} />} />
        <Route
          path="/docs/:id"
          element={
            <>
              <NavBar/>
              <Editor/>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
