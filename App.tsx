
import React, { useState } from 'react';
import MapBackground from './components/MapBackground';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MineralRecognizer from './components/MineralRecognizer';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import MappingPage from './components/MappingPage';
import DatabasePage from './components/DatabasePage';
import ExplorationPage from './components/ExplorationPage';
import HSEPage from './components/HSEPage';
import UserProfilePage from './components/UserProfilePage';
import AdminPage from './components/AdminPage';
import CompilationSheetPage from './components/CompilationSheetPage';
import { View } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('isAuthenticated') === 'true');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => sessionStorage.getItem('currentUserEmail'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('Dashboard');

  const isAdmin = currentUserEmail === 'serignesalioudiouf71@gmail.com';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleAuthSuccess = (email: string) => {
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('currentUserEmail', email);
    setIsAuthenticated(true);
    setCurrentUserEmail(email);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('currentUserEmail');
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
    setActiveView('Dashboard');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Analyse IA':
        return <MineralRecognizer />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Feuille de compilation':
        return <CompilationSheetPage />;
      case 'Cartographie & SIG':
        return <MappingPage />;
      case 'Base de Données':
        return <DatabasePage />;
      case 'Exploration':
        return <ExplorationPage />;
      case 'HSE & Reporting':
        return <HSEPage />;
      case 'User Profile':
        return <UserProfilePage />;
      case 'Administration':
        return isAdmin ? <AdminPage /> : null;
      default:
        return (
          <div className="p-6 max-w-7xl mx-auto text-center">
             <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-10 border border-gray-700">
                <h2 className="text-2xl font-bold text-amber-400">{activeView}</h2>
                <p className="mt-4 text-gray-400">Cette fonctionnalité est en cours de développement.</p>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200">
      <MapBackground />
      {!isAuthenticated ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : (
        <div className="relative z-10 flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            activeView={activeView}
            setActiveView={setActiveView}
            isAdmin={isAdmin}
          />
          <div className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out">
            <Header
              onMenuClick={toggleSidebar}
              onLogout={handleLogout}
              onProfileClick={() => setActiveView('User Profile')}
            />
            <main className="pt-20">
              {renderContent()}
            </main>
          </div>
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;