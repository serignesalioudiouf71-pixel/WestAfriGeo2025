import React, { useState } from 'react';
import IncidentReportForm from './IncidentReportForm';
import SiteInspectionForm from './SiteInspectionForm';
import EnvironmentalObservationForm from './EnvironmentalObservationForm';

type HSEView = 'incident_report' | 'site_inspection' | 'environmental_observation';

const HSEPage: React.FC = () => {
    const [activeView, setActiveView] = useState<HSEView>('incident_report');

    const renderContent = () => {
        switch (activeView) {
            case 'incident_report':
                return <IncidentReportForm />;
            case 'site_inspection':
                return <SiteInspectionForm />;
            case 'environmental_observation':
                return <EnvironmentalObservationForm />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{ view: HSEView; label: string; }> = ({ view, label }) => (
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
                    <h2 className="text-2xl font-bold text-amber-400">HSE & Reporting</h2>
                    <p className="text-gray-400 mt-1">Saisie des rapports de Santé, Sécurité et Environnement.</p>
                </div>

                <div className="border-b border-gray-700 px-4">
                    <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
                        <TabButton view="incident_report" label="Rapport d'Incident" />
                        <TabButton view="site_inspection" label="Inspection de Site" />
                        <TabButton view="environmental_observation" label="Observation Environnementale" />
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default HSEPage;