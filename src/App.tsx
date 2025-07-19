import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import CandidatesPage from './CandidatePage';
import VotersPage from './VotersPage';
import PositionsPage from './PositionsPage';
import VotePage from './VotePage';
import ResultPage from './ResultPage';
import Sidebar from './Sidebar';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <div
          className={`overlay ${isSidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        ></div>

        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        <main className={isSidebarOpen ? 'content-shifted' : ''}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/voters" element={<VotersPage />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/results" element={<ResultPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;