import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import Location from './components/location';
import Donate from './components/donate';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/about" element={<Home Page={<About />} />} />
        <Route path="/donate" element={<Home Page={<Donate />} />} />
        <Route path="/location" element={<Location />} />
      </Routes>
    </Router>
  );
}

export default App;
