import React, { useState } from 'react';
import GeochemistryPage from './GeochemistryPage';
import RCDrillingPage from './RCDrillingPage';
import DDDrillingPage from './DDDrillingPage';
import OperationalTrackingPage from './OperationalTrackingPage';

type DatabaseView = 'geochemistry' | 'rc_drilling' | 'dd_drilling' | 'operations';

const DatabasePage: React.FC = () => {
  const [activeView, setActiveView] = useState<DatabaseView>('geochemistry');

  const renderContent = () => {
    switch (activeView) {
      case 'geochemistry':
        return <GeochemistryPage />;
      case 'rc_drilling':
        return <RCDrillingPage />;
      case 'dd_drilling':
        return <DDDrillingPage />;
      case 'operations':
        return <OperationalTrackingPage />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ view: DatabaseView; label: string; }> = ({ view, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
        activeView === view
          ? 'bg-gray-800/50 border-b-2 border-amber-400 text-amber-400'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 max-w-full mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-amber-400">Base de Données Géologiques</h2>
                <p className="text-gray-400 mt-1">Saisie et consultation des données de terrain.</p>
            </div>

            <div className="border-b border-gray-700 px-4">
                <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
                    <TabButton view="geochemistry" label="1. Géochimie" />
                    <TabButton view="rc_drilling" label="2. Sondage RC" />
                    <TabButton view="dd_drilling" label="3. Sondage DD" />
                    <TabButton view="operations" label="4. Suivi Opérationnel" />
                </nav>
            </div>
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default DatabasePage;