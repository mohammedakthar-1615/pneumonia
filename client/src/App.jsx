import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Predict from './pages/predicit';
import Dashboard from './pages/Dashboard';
import About from './pages/about';
import History from './pages/History';
import Precautions from './pages/Precautions';
import Navbar from './components/common/Navbar';
import './App.css';
import './styles/results.css';

const AppLayout = ({ children }) => {
  return (
    <div className="App">
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/precautions" element={<Precautions />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
