
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Instruments from './pages/Instruments';
import Calibrations from './pages/Calibrations';
import Reports from './pages/Reports';
import Integration from './pages/Integration';
import ExternalServices from './pages/ExternalServices';
import Laboratories from './pages/Laboratories';
import WorkOrders from './pages/WorkOrders';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');

  // Basic routing using hash or state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/instruments':
        return <Instruments />;
      case '/calibrations':
        return <Calibrations />;
      case '/os':
        return <WorkOrders />;
      case '/reports':
        return <Reports />;
      case '/integration':
        return <Integration />;
      case '/external-services':
        return <ExternalServices />;
      case '/laboratories':
        return <Laboratories />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Módulo em Desenvolvimento</h2>
            <p>A tela "{currentPath}" estará disponível no próximo sprint.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Voltar ao Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <Layout activePath={currentPath} onNavigate={navigate}>
      {renderContent()}
    </Layout>
  );
};

export default App;
