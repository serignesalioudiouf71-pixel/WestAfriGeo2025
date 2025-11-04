import React, { useState } from 'react';
import { downloadData } from '../utils/download';

// Re-using existing components for styling
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const InputField: React.FC<{ label: string; id: string; type?: string; placeholder?: string; value: string | number; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; className?: string; isTextArea?: boolean }> = ({ label, id, type = "text", placeholder, value, name, onChange, className, isTextArea }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {isTextArea ? (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
      />
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
      />
    )}
  </div>
);


const initialFormData = {
    N_Id: '',
    N_Echantillon: '',
    Ligne: '',
    UTM_E: '',
    UTM_N: '',
    Alt: '',
    QAQC: '',
    Type: '',
    Taille: '',
    Couleur: '',
    Poids: '',
    Geologue: '',
    Date: '',
    Commentaire: ''
};

const GeochemistryPage: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Geochemistry Data Submitted:", formData);
        alert("Données de géochimie enregistrées ! (Voir console)");
        setFormData(initialFormData);
    };
    
    const handleDownload = () => {
        // In a real app, you would download a list of submitted samples.
        // Here, we download the current form data as an example.
        downloadData([formData], 'geochemistry_sample.csv');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Fiche Géochimie (Sol et Termitière)">
                <InputField label="N_Id" id="N_Id" name="N_Id" value={formData.N_Id} onChange={handleChange} />
                <InputField label="N° Echantillon" id="N_Echantillon" name="N_Echantillon" value={formData.N_Echantillon} onChange={handleChange} />
                <InputField label="Ligne" id="Ligne" name="Ligne" value={formData.Ligne} onChange={handleChange} />
                <InputField label="UTM-E (m)" id="UTM_E" name="UTM_E" type="number" value={formData.UTM_E} onChange={handleChange} />
                <InputField label="UTM-N (m)" id="UTM_N" name="UTM_N" type="number" value={formData.UTM_N} onChange={handleChange} />
                <InputField label="Alt (m)" id="Alt" name="Alt" type="number" value={formData.Alt} onChange={handleChange} />
                <InputField label="QAQC" id="QAQC" name="QAQC" value={formData.QAQC} onChange={handleChange} />
                <InputField label="Type" id="Type" name="Type" value={formData.Type} onChange={handleChange} />
                <InputField label="Taille" id="Taille" name="Taille" value={formData.Taille} onChange={handleChange} />
                <InputField label="Couleur" id="Couleur" name="Couleur" value={formData.Couleur} onChange={handleChange} />
                <InputField label="Poids" id="Poids" name="Poids" type="number" value={formData.Poids} onChange={handleChange} />
                <InputField label="Géologue" id="Geologue" name="Geologue" value={formData.Geologue} onChange={handleChange} />
                <InputField label="Date" id="Date" name="Date" type="date" value={formData.Date} onChange={handleChange} />
                <InputField label="Commentaire" id="Commentaire" name="Commentaire" value={formData.Commentaire} onChange={handleChange} className="md:col-span-2 lg:col-span-3" isTextArea={true} />
            </FormSection>
            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="button" onClick={() => setFormData(initialFormData)} className="bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Enregistrer l'échantillon
                </button>
            </div>
        </form>
    );
};

export default GeochemistryPage;