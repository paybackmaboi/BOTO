import React, { useState } from 'react';
import HomePage from './HomePage';
import VotesPage from './VotePage';
import VotersPage from './VotersPage';
import PositionsPage from './PositionsPage';
import CandidatesPage from './CandidatePage';
import ResultsPage from './ResultPage';
import './App.css';

type Page = 'Home' | 'Votes' | 'Voters' | 'Positions' | 'Candidates' | 'Results';

const menu: { label: Page }[] = [
  { label: 'Home' },
  { label: 'Votes' },
  { label: 'Voters' },
  { label: 'Positions' },
  { label: 'Candidates' },
  { label: 'Results' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home': return <HomePage />;
      case 'Votes': return <VotesPage />;
      case 'Voters': return <VotersPage />;
      case 'Positions': return <PositionsPage />;
      case 'Candidates': return <CandidatesPage />;
      case 'Results': return <ResultsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        id="hamburger"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(s => !s)}
        style={{ left: sidebarOpen ? 'calc(var(--sidebar-width) + 16px)' : 16 }}
      >
      </button>

      {/* Sidebar */}
      <nav id="sidebar" className={sidebarOpen ? 'show' : ''}>
        <div>
          {menu.map(item => (
            <a
              key={item.label}
              className={`nav-link${currentPage === item.label ? ' active' : ''}`}
              href="#"
              onClick={e => { e.preventDefault(); setCurrentPage(item.label); setSidebarOpen(false); }}
            >
            
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main id="content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        {renderPage()}
      </main>
    </>
  );
};

export default App;