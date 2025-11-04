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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, id, name, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
  </div>
);

const initialFormData = {
    date: new Date().toISOString().split('T')[0],
    equipmentId: '',
    startHours: '',
    endHours: '',
    fuelAdded: '',
    operator: '',
};

const FuelTrackingForm: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Fuel Tracking Submitted:", formData);
        alert("Fiche de suivi carburant enregistrée ! (Voir console)");
        setFormData(initialFormData);
    };

    const handleDownload = () => {
        downloadData([formData], 'fuel_tracking.csv');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Fiche de Suivi Carburant">
                <FormField label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                <FormField label="Équipement / Véhicule ID" id="equipmentId" name="equipmentId" value={formData.equipmentId} onChange={handleChange} placeholder="ex: Sondeuse-01, Hilux-05" />
                <FormField label="Horomètre / KM Début" id="startHours" name="startHours" type="number" value={formData.startHours} onChange={handleChange} />
                <FormField label="Horomètre / KM Fin" id="endHours" name="endHours" type="number" value={formData.endHours} onChange={handleChange} />
                <FormField label="Carburant Ajouté (Litres)" id="fuelAdded" name="fuelAdded" type="number" value={formData.fuelAdded} onChange={handleChange} />
                <FormField label="Opérateur / Chauffeur" id="operator" name="operator" value={formData.operator} onChange={handleChange} />
            </FormSection>
            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="button" onClick={() => setFormData(initialFormData)} className="bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Enregistrer la Consommation
                </button>
            </div>
        </form>
    );
};

export default FuelTrackingForm;