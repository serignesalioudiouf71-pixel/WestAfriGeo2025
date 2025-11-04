import React, { useState } from 'react';
import GeologicalMappingForm from './GeologicalMappingForm';
import TrenchLogForm from './TrenchLogForm';

type ExplorationView = 'geological_mapping' | 'trench_log';

const ExplorationPage: React.FC = () => {
    const [activeView, setActiveView] = useState<ExplorationView>('geological_mapping');

    const renderContent = () => {
        switch (activeView) {
            case 'geological_mapping':
                return <GeologicalMappingForm />;
            case 'trench_log':
                return <TrenchLogForm />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{ view: ExplorationView; label: string; }> = ({ view, label }) => (
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
                    <h2 className="text-2xl font-bold text-amber-400">Données d'Exploration</h2>
                    <p className="text-gray-400 mt-1">Saisie des données de cartographie, tranchées, et puits.</p>
                </div>

                <div className="border-b border-gray-700 px-4">
                    <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
                        <TabButton view="geological_mapping" label="Cartographie Géologique" />
                        <TabButton view="trench_log" label="Log de Tranchée / Puits" />
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ExplorationPage;