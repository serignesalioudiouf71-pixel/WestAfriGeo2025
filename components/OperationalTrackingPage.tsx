import React, { useState } from 'react';
import DailyReportForm from './DailyReportForm';
import SampleDispatchForm from './SampleDispatchForm';
import SafetyMeetingForm from './SafetyMeetingForm';
import FuelTrackingForm from './FuelTrackingForm';
import MachineryLogForm from './MachineryLogForm';

type OperationalView = 'daily_report' | 'sample_dispatch' | 'safety_meeting' | 'fuel_tracking' | 'machinery_log';

const OperationalTrackingPage: React.FC = () => {
    const [activeView, setActiveView] = useState<OperationalView>('daily_report');

    const renderContent = () => {
        switch (activeView) {
            case 'daily_report':
                return <DailyReportForm />;
            case 'sample_dispatch':
                return <SampleDispatchForm />;
            case 'safety_meeting':
                return <SafetyMeetingForm />;
            case 'fuel_tracking':
                return <FuelTrackingForm />;
            case 'machinery_log':
                return <MachineryLogForm />;
            default: return null;
        }
    };
    
    const SubTabButton: React.FC<{ view: OperationalView; label: string; }> = ({ view, label }) => (
        <button onClick={() => setActiveView(view)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeView === view ? 'bg-amber-500/20 text-amber-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex items-center flex-wrap gap-2 p-2 rounded-lg bg-gray-900/50">
                <SubTabButton view="daily_report" label="Minute de Terrain" />
                <SubTabButton view="sample_dispatch" label="Envoi Échantillons" />
                <SubTabButton view="safety_meeting" label="Safety Meeting" />
                <SubTabButton view="fuel_tracking" label="Suivi Carburant" />
                <SubTabButton view="machinery_log" label="Suivi Engins" />
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

// Fix: An export assignment cannot have modifiers. Removed extra 'export'.
export default OperationalTrackingPage;