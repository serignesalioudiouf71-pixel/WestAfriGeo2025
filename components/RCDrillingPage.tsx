import React, { useState } from 'react';
import { downloadData } from '../utils/download';

// Re-using styles for consistency
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50 mt-4">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
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

const SimpleForm: React.FC<{ title: string; fields: { name: string; label: string; type?: string }[] }> = ({ title, fields }) => {
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
        downloadData([formData], `rc_drilling_${title.toLowerCase()}.csv`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormSection title={title}>
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

type RCSubView = 'collar' | 'survey' | 'assay' | 'geology';

const RCDrillingPage: React.FC = () => {
    const [activeView, setActiveView] = useState<RCSubView>('collar');

    const renderContent = () => {
        switch (activeView) {
            case 'collar':
                return <SimpleForm title="Collar" fields={[
                    { name: 'hole_id', label: 'Hole ID' },
                    { name: 'x', label: 'X', type: 'number' },
                    { name: 'y', label: 'Y', type: 'number' },
                    { name: 'z', label: 'Z', type: 'number' },
                    { name: 'max_depth', label: 'MAXDEEPTH', type: 'number' },
                ]} />;
            case 'survey':
                return <SimpleForm title="Survey" fields={[
                    { name: 'hole_id', label: 'Hole ID' },
                    { name: 'depth', label: 'Depth', type: 'number' },
                    { name: 'dip', label: 'Dip', type: 'number' },
                    { name: 'azimuth', label: 'Azimuth', type: 'number' },
                ]} />;
            case 'assay':
                return <SimpleForm title="Assay" fields={[
                    { name: 'hole_id', label: 'Hole ID' },
                    { name: 'depth_from', label: 'Depth From', type: 'number' },
                    { name: 'depth_to', label: 'Depth To', type: 'number' },
                    { name: 'analyse', label: 'Analyse' },
                ]} />;
            case 'geology':
                return <SimpleForm title="Geology" fields={[
                    { name: 'hole_id', label: 'Hole ID' },
                    { name: 'depth_from', label: 'Depth From', type: 'number' },
                    { name: 'depth_to', label: 'Depth To', type: 'number' },
                    { name: 'lithologie', label: 'Lithologie' },
                ]} />;
            default: return null;
        }
    };
    
    const SubTabButton: React.FC<{ view: RCSubView; label: string; }> = ({ view, label }) => (
        <button onClick={() => setActiveView(view)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeView === view ? 'bg-amber-500/20 text-amber-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex items-center flex-wrap gap-2 p-2 rounded-lg bg-gray-900/50 w-full md:w-auto">
                <SubTabButton view="collar" label="Collar" />
                <SubTabButton view="survey" label="Survey" />
                <SubTabButton view="assay" label="Assay" />
                <SubTabButton view="geology" label="Géologie" />
            </div>
            {renderContent()}
        </div>
    );
};

export default RCDrillingPage;