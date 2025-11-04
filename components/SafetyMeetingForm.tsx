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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string; as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
}> = ({ label, id, name, value, onChange, type = 'text', as = 'input', options = [], className = '', placeholder }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {as === 'input' && <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
    {as === 'textarea' && <textarea id={id} name={name} value={value as string} onChange={onChange} placeholder={placeholder} rows={4} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />}
    {as === 'select' && <select id={id} name={name} value={value} onChange={onChange} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>}
  </div>
);

const initialFormData = {
    date: new Date().toISOString().split('T')[0],
    time: '',
    shift: 'day',
    sondageType: 'rc',
    leader: '',
    attendees: '',
    topics: '',
    actions: '',
};

const SafetyMeetingForm: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Safety Meeting Submitted:", formData);
        alert("Fiche de safety meeting enregistrée ! (Voir console)");
        setFormData(initialFormData);
    };

    const handleDownload = () => {
        downloadData([formData], 'safety_meeting.csv');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Fiche de Safety Meeting">
                <FormField label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                <FormField label="Heure" id="time" name="time" type="time" value={formData.time} onChange={handleChange} />
                <FormField label="Shift" id="shift" name="shift" as="select" options={[{value: 'day', label: 'Jour'}, {value: 'night', label: 'Nuit'}]} value={formData.shift} onChange={handleChange} />
                <FormField label="Type de Sondage" id="sondageType" name="sondageType" as="select" options={[{value: 'rc', label: 'RC'}, {value: 'dd', label: 'DD'}, {value: 'autre', label: 'Autre'}]} value={formData.sondageType} onChange={handleChange} />
                <FormField label="Animateur de la réunion" id="leader" name="leader" value={formData.leader} onChange={handleChange} className="md:col-span-2" />
                <FormField label="Participants" id="attendees" name="attendees" as="textarea" value={formData.attendees} onChange={handleChange} className="md:col-span-2" placeholder="Listez les noms des participants" />
                <FormField label="Sujets discutés" id="topics" name="topics" as="textarea" value={formData.topics} onChange={handleChange} className="md:col-span-2" />
                <FormField label="Actions / Décisions" id="actions" name="actions" as="textarea" value={formData.actions} onChange={handleChange} className="md:col-span-2" />
            </FormSection>
            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="button" onClick={() => setFormData(initialFormData)} className="bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Enregistrer la Fiche
                </button>
            </div>
        </form>
    );
};

export default SafetyMeetingForm;