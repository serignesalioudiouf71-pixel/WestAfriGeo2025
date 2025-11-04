import React, { useState } from 'react';
import { downloadData } from '../utils/download';

// Re-using components
const FormSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const FormField: React.FC<{
  label: string; id: string; name: string; value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; as?: 'input' | 'textarea';
  className?: string;
  placeholder?: string;
}> = ({ label, id, name, value, onChange, type = 'text', as = 'input', className = '', placeholder }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {as === 'input' && <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
    {as === 'textarea' && <textarea id={id} name={name} value={value as string} onChange={onChange} placeholder={placeholder} rows={8} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
  </div>
);

const initialFormData = {
    trenchId: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    length: '',
    width: '',
    depth: '',
    geologist: '',
    logDetails: ''
};

const TrenchLogForm: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Trench Log Submitted:", formData);
        alert("Log de tranchée enregistré ! (Voir console)");
        setFormData(initialFormData);
    };
    
    const handleDownload = () => {
        const { logDetails, ...headerData } = formData;
        // A simple parser for the example format
        const logEntries = logDetails.split('\n')
            .slice(1) // skip header
            .map(line => line.split('|').map(item => item.trim()))
            .filter(arr => arr.length === 5)
            .map(arr => ({
                ...headerData,
                from_m: arr[0],
                to_m: arr[1],
                lithology: arr[2],
                description: arr[3],
                sample_id: arr[4],
            }));

        if (logEntries.length > 0) {
            downloadData(logEntries, `trench_log_${formData.trenchId || 'data'}.csv`);
        } else {
            // Download only header if log is empty
            downloadData([headerData], `trench_log_${formData.trenchId || 'header'}.csv`);
        }
    };

    const logPlaceholder = `Exemple de format:
De (m) | À (m) | Lithologie | Description | N° Échantillon
0.0 | 1.5 | Sol Végétal | Racine et humus | -
1.5 | 4.0 | Latérite | Indurée, blocs | TR01-S01
4.0 | 7.2 | Saprolite | Argileux, structure conservée de la roche mère | TR01-S02
...`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Informations sur la Tranchée / Puits">
                <FormField label="ID Tranchée / Puits" id="trenchId" name="trenchId" value={formData.trenchId} onChange={handleChange} placeholder="ex: TR-01, PUITS-A" />
                <FormField label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                <FormField label="Localisation / Ligne" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Ligne 1200N" />
                <FormField label="Géologue" id="geologist" name="geologist" value={formData.geologist} onChange={handleChange} />
                <FormField label="Longueur (m)" id="length" name="length" type="number" value={formData.length} onChange={handleChange} />
                <FormField label="Largeur (m)" id="width" name="width" type="number" value={formData.width} onChange={handleChange} />
                <FormField label="Profondeur (m)" id="depth" name="depth" type="number" value={formData.depth} onChange={handleChange} />
            </FormSection>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-amber-400 mb-4">Log Géologique et Échantillonnage</h3>
                <FormField
                    label="Détails du Log par intervalle"
                    id="logDetails"
                    name="logDetails"
                    as="textarea"
                    value={formData.logDetails}
                    onChange={handleChange}
                    className="w-full"
                    placeholder={logPlaceholder}
                />
            </div>
            
            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="button" onClick={() => setFormData(initialFormData)} className="bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Enregistrer le Log
                </button>
            </div>
        </form>
    );
};

export default TrenchLogForm;