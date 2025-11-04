import React, { useState } from 'react';
import { downloadData } from '../utils/download';

// Re-using components for consistent styling from other forms
const FormSection: React.FC<{ title: string; children: React.ReactNode; cols?: number }> = ({ title, children, cols = 3 }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-x-6 gap-y-4`}>
      {children}
    </div>
  </div>
);

const FormField: React.FC<{
  label: string; id: string; name: string; value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string; as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
}> = ({ label, id, name, value, onChange, type = 'text', as = 'input', options = [], className = '', placeholder }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {as === 'input' && <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
    {as === 'textarea' && <textarea id={id} name={name} value={value as string} onChange={onChange} placeholder={placeholder} rows={3} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
    {as === 'select' && <select id={id} name={name} value={value} onChange={onChange} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>}
  </div>
);

const initialFormData = {
    outcropId: '',
    date: new Date().toISOString().split('T')[0],
    geologist: '',
    utmE: '',
    utmN: '',
    alt: '',
    lithology: '',
    description: '',
    structureType: 'bedding',
    dip: '',
    strike: '',
    alteration: '',
    mineralization: '',
    photoId: '',
    comments: ''
};

const GeologicalMappingForm: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Geological Mapping Data Submitted:", formData);
        alert("Données de cartographie enregistrées ! (Voir console)");
        setFormData(initialFormData);
    };

    const handleDownload = () => {
        downloadData([formData], 'geological_mapping.csv');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Information sur l'Affleurement">
                <FormField label="ID Affleurement" id="outcropId" name="outcropId" value={formData.outcropId} onChange={handleChange} placeholder="ex: AFF-001" />
                <FormField label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                <FormField label="Géologue" id="geologist" name="geologist" value={formData.geologist} onChange={handleChange} />
                <FormField label="UTM E" id="utmE" name="utmE" type="number" value={formData.utmE} onChange={handleChange} />
                <FormField label="UTM N" id="utmN" name="utmN" type="number" value={formData.utmN} onChange={handleChange} />
                <FormField label="Altitude (m)" id="alt" name="alt" type="number" value={formData.alt} onChange={handleChange} />
            </FormSection>

            <FormSection title="Description Géologique" cols={2}>
                <FormField label="Lithologie" id="lithology" name="lithology" value={formData.lithology} onChange={handleChange} placeholder="ex: Méta-volcanite, Granodiorite" />
                 <FormField label="ID Photo" id="photoId" name="photoId" value={formData.photoId} onChange={handleChange} placeholder="ex: IMG_1024" />
                <FormField label="Description" id="description" name="description" as="textarea" value={formData.description} onChange={handleChange} className="md:col-span-2" />
                <FormField label="Altération" id="alteration" name="alteration" value={formData.alteration} onChange={handleChange} placeholder="ex: Silicification, Carbonatation" />
                <FormField label="Minéralisation" id="mineralization" name="mineralization" value={formData.mineralization} onChange={handleChange} placeholder="ex: Pyrite disséminée 2%" />
            </FormSection>

            <FormSection title="Mesures Structurales">
                <FormField label="Type de Structure" id="structureType" name="structureType" as="select" value={formData.structureType} onChange={handleChange} options={[
                    { value: 'bedding', label: 'Stratification'},
                    { value: 'foliation', label: 'Foliation'},
                    { value: 'vein', label: 'Veine'},
                    { value: 'fault', label: 'Faille'},
                    { value: 'joint', label: 'Diaclase'},
                ]} />
                <FormField label="Pendage (Dip °)" id="dip" name="dip" type="number" value={formData.dip} onChange={handleChange} placeholder="0-90" />
                <FormField label="Direction (Strike °)" id="strike" name="strike" type="number" value={formData.strike} onChange={handleChange} placeholder="0-360" />
            </FormSection>

            <FormField label="Commentaires Supplémentaires" id="comments" name="comments" as="textarea" value={formData.comments} onChange={handleChange} className="w-full" />

            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="button" onClick={() => setFormData(initialFormData)} className="bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Enregistrer l'Affleurement
                </button>
            </div>
        </form>
    );
};

export default GeologicalMappingForm;