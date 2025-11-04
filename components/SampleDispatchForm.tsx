import React, { useState } from 'react';
import { downloadData } from '../utils/download';

// Shared components for consistent styling
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
    {as === 'textarea' && <textarea id={id} name={name} value={value as string} onChange={onChange} placeholder={placeholder} rows={5} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
  </div>
);

const initialFormData = {
    dispatchId: '',
    date: new Date().toISOString().split('T')[0],
    labName: '',
    sampleIds: '',
    sampleCount: '',
    dispatchedBy: '',
    receivedBy: ''
};

const SampleDispatchForm: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sample Dispatch Submitted:", formData);
        alert("Fiche d'envoi enregistrée ! (Voir console)");
        setFormData(initialFormData);
    };

    const handleDownload = () => {
        downloadData([formData], 'sample_dispatch.csv');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Fiche d'Envoi des Échantillons">
                <FormField label="ID d'envoi" id="dispatchId" name="dispatchId" value={formData.dispatchId} onChange={handleChange} placeholder="ex: BATCH-001" />
                <FormField label="Date d'envoi" id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                <FormField label="Nom du Laboratoire" id="labName" name="labName" value={formData.labName} onChange={handleChange} placeholder="ex: SGS, Intertek" />
                <FormField label="Expédié par" id="dispatchedBy" name="dispatchedBy" value={formData.dispatchedBy} onChange={handleChange} />
                <FormField label="Nombre total d'échantillons" id="sampleCount" name="sampleCount" type="number" value={formData.sampleCount} onChange={handleChange} />
                <FormField label="Reçu par (Laboratoire)" id="receivedBy" name="receivedBy" value={formData.receivedBy} onChange={handleChange} />
                <FormField label="Numéros des Échantillons" id="sampleIds" name="sampleIds" as="textarea" value={formData.sampleIds} onChange={handleChange} className="md:col-span-2" placeholder="ex: SA001-SA150, DUP01, BLK01..." />
            </FormSection>
            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="button" onClick={() => setFormData(initialFormData)} className="bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Enregistrer l'Envoi
                </button>
            </div>
        </form>
    );
};

export default SampleDispatchForm;