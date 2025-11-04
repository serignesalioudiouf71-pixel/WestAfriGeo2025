import React, { useState } from 'react';
import { downloadData } from '../utils/download';

// Re-using styles for consistency
const FormSection: React.FC<{ title: string; children: React.ReactNode; cols?: number }> = ({ title, children, cols=4 }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50 mt-4">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-x-6 gap-y-4`}>
      {children}
    </div>
  </div>
);

const InputField: React.FC<{ label: string; id: string; type?: string; value: any; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, id, type = "text", value, name, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
    />
  </div>
);

const SimpleForm: React.FC<{ title: string; fields: { name: string; label: string; type?: string }[]; cols?: number }> = ({ title, fields, cols }) => {
    const [formData, setFormData] = useState(() => fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Données pour ${title} enregistrées! (Voir console)`);
        console.log({ [title]: formData });
        setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    };

    const handleDownload = () => {
        downloadData([formData], `dd_drilling_${title.toLowerCase().replace(/\s/g, '_')}.csv`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormSection title={title} cols={cols}>
                {fields.map(field => (
                    <InputField key={field.name} label={field.label} id={field.name} name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} />
                ))}
            </FormSection>
             <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-all text-sm mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-all text-sm">
                    Enregistrer
                </button>
            </div>
        </form>
    );
};

type DDSubView = 'collar' | 'survey' | 'assay' | 'geology' | 'geotech';

const DDDrillingPage: React.FC = () => {
    const [activeView, setActiveView] = useState<DDSubView>('collar');

    const renderContent = () => {
        switch (activeView) {
            case 'collar':
                return <SimpleForm title="Collar" fields={[
                    { name: 'hole_id', label: 'Hole ID' }, { name: 'x', label: 'X', type: 'number' }, { name: 'y', label: 'Y', type: 'number' }, { name: 'z', label: 'Z', type: 'number' }, { name: 'max_depth', label: 'MAXDEEPTH', type: 'number' },
                ]} />;
            case 'survey':
                return <SimpleForm title="Survey" fields={[
                    { name: 'hole_id', label: 'Hole ID' }, { name: 'depth', label: 'Depth', type: 'number' }, { name: 'dip', label: 'Dip', type: 'number' }, { name: 'azimuth', label: 'Azimuth', type: 'number' },
                ]} />;
            case 'assay':
                return <SimpleForm title="Assay" fields={[
                    { name: 'hole_id', label: 'Hole ID' }, { name: 'depth_from', label: 'Depth From', type: 'number' }, { name: 'depth_to', label: 'Depth To', type: 'number' }, { name: 'analyse', label: 'Analyse' },
                ]} />;
            case 'geology':
                return <SimpleForm title="Geology" fields={[
                    { name: 'hole_id', label: 'Hole ID' }, { name: 'depth_from', label: 'Depth From', type: 'number' }, { name: 'depth_to', label: 'Depth To', type: 'number' }, { name: 'lithologie', label: 'Lithologie' },
                ]} />;
            case 'geotech':
                 return <SimpleForm title="Renseignements Géotechniques" cols={5} fields={[
                    { name: 'hole_id', label: 'Hole ID' }, { name: 'from_m', label: 'From (m)', type: 'number' }, { name: 'to_m', label: 'To (m)', type: 'number' }, { name: 'interval_m', label: 'Interval (m)', type: 'number' }, { name: 'rec_length_m', label: 'Rec_Length (m)', type: 'number' },
                    { name: 'recovery_pct', label: 'Recovery (%)', type: 'number' }, { name: 'rqd_pct', label: 'RQD (%)', type: 'number' }, { name: 'rqd_class', label: 'RQD_CLASS' }, { name: 'rock_type', label: 'ROCK TYPE' }, { name: 'weathering', label: 'Weathering' },
                    { name: 'strength', label: 'Strength' }, { name: 'joints', label: 'Joints' }, { name: 'joint_spacing_m', label: 'Joint_Spacing (m)', type: 'number' }, { name: 'joint_type', label: 'Joint_Type' }, { name: 'joint_condition', label: 'Joint_Condition' },
                    { name: 'joint_infill', label: 'Joint_Infill' }, { name: 'dip_deg', label: 'DIP (°)', type: 'number' }, { name: 'dip_dir_deg', label: 'DIP_DIR (°)', type: 'number' }, { name: 'groundwater', label: 'Groundwater' }, { name: 'water_level_m', label: 'Water_Level (L/m)', type: 'number' },
                    { name: 'flow_rate_l_min', label: 'Flow_Rate (l/min)', type: 'number' }, { name: 'comment', label: 'Comment' }, { name: 'photo_ref', label: 'Photo_Ref' }, { name: 'rmr', label: 'RMR' }, { name: 'q_system', label: 'Q_System' },
                ]} />;
            default: return null;
        }
    };
    
    const SubTabButton: React.FC<{ view: DDSubView; label: string; }> = ({ view, label }) => (
        <button onClick={() => setActiveView(view)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeView === view ? 'bg-amber-500/20 text-amber-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex items-center flex-wrap gap-2 p-2 rounded-lg bg-gray-900/50">
                <SubTabButton view="collar" label="Collar" />
                <SubTabButton view="survey" label="Survey" />
                <SubTabButton view="assay" label="Assay" />
                <SubTabButton view="geology" label="Géologie" />
                <SubTabButton view="geotech" label="Géotechnique" />
            </div>
            {renderContent()}
        </div>
    );
};

export default DDDrillingPage;