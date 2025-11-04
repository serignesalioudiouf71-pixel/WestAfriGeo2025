import React, { useState } from 'react';
import { downloadData } from '../utils/download';

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50 mt-6">
    <h3 className="text-lg font-bold text-amber-400 mb-4">{title}</h3>
    {children}
  </div>
);

const CheckboxItem: React.FC<{ label: string; name: string; value: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onCommentChange: (name: string, comment: string) => void; comment: string; }> = ({ label, name, value, checked, onChange, onCommentChange, comment }) => (
    <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4 border-t border-gray-700/50">
        <dt className="text-sm font-medium text-gray-300 flex items-center">{label}</dt>
        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-3 items-center gap-4">
            <div className="flex items-center">
                 <input id={`${name}-${value}`} name={name} type="radio" value={value} checked={checked} onChange={onChange} className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-500 bg-gray-800" />
                 <label htmlFor={`${name}-${value}`} className="ml-2 block text-sm text-gray-300 capitalize">{value}</label>
            </div>
            {value === 'non-conforme' && (
                <input
                    type="text"
                    placeholder="Commentaire/Action corrective"
                    value={comment}
                    onChange={(e) => onCommentChange(name, e.target.value)}
                    className="flex-grow bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
            )}
        </dd>
    </div>
);


const initialInspectionState = {
    ppe: { status: 'conforme', comment: '' },
    tools: { status: 'conforme', comment: '' },
    machinery: { status: 'conforme', comment: '' },
    siteAccess: { status: 'conforme', comment: '' },
    housekeeping: { status: 'conforme', comment: '' },
};
// FIX: Define key type for safer object property access.
type InspectionItemKey = keyof typeof initialInspectionState;

const SiteInspectionForm: React.FC = () => {
    const [inspector, setInspector] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [inspectionData, setInspectionData] = useState(initialInspectionState);

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // FIX: Cast name to a valid key to ensure type safety.
        const key = name as InspectionItemKey;
        setInspectionData(prev => ({
            ...prev,
            [key]: { ...prev[key], status: value }
        }));
    };

    const handleCommentChange = (name: string, comment: string) => {
        // FIX: Cast name to a valid key to ensure type safety.
        const key = name as InspectionItemKey;
        setInspectionData(prev => ({
            ...prev,
            [key]: { ...prev[key], comment }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullReport = { inspector, date, inspectionData };
        console.log("Site Inspection Submitted:", fullReport);
        alert("Inspection de site enregistrée ! (Voir console)");
    };

    const handleDownload = () => {
        // FIX: Cast `values` from Object.entries to its expected type to prevent 'unknown' type errors.
        const dataToDownload = Object.entries(inspectionData).map(([item, values]) => {
            const typedValues = values as { status: string; comment: string };
            return {
                inspecteur: inspector,
                date: date,
                item: item,
                status: typedValues.status,
                commentaire: typedValues.comment,
            };
        });
        downloadData(dataToDownload, 'site_inspection.csv');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="inspector" className="block text-sm font-medium text-gray-300 mb-1">Inspecteur</label>
                        <input type="text" id="inspector" value={inspector} onChange={(e) => setInspector(e.target.value)} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full bg-gray-900/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500" />
                    </div>
                </div>
            </div>

            <FormSection title="Checklist d'Inspection">
                <dl>
                    <CheckboxItem label="Port des EPI (Casque, chaussures, etc.)" name="ppe" value="conforme" checked={inspectionData.ppe.status === 'conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.ppe.comment} />
                    <CheckboxItem label="" name="ppe" value="non-conforme" checked={inspectionData.ppe.status === 'non-conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.ppe.comment} />

                    <CheckboxItem label="État des outils et équipements" name="tools" value="conforme" checked={inspectionData.tools.status === 'conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.tools.comment} />
                    <CheckboxItem label="" name="tools" value="non-conforme" checked={inspectionData.tools.status === 'non-conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.tools.comment} />

                    <CheckboxItem label="Sécurité des machines (gardes, arrêts d'urgence)" name="machinery" value="conforme" checked={inspectionData.machinery.status === 'conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.machinery.comment} />
                    <CheckboxItem label="" name="machinery" value="non-conforme" checked={inspectionData.machinery.status === 'non-conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.machinery.comment} />

                    <CheckboxItem label="Contrôle d'accès et signalisation" name="siteAccess" value="conforme" checked={inspectionData.siteAccess.status === 'conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.siteAccess.comment} />
                    <CheckboxItem label="" name="siteAccess" value="non-conforme" checked={inspectionData.siteAccess.status === 'non-conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.siteAccess.comment} />

                    <CheckboxItem label="Ordre et propreté du site (Housekeeping)" name="housekeeping" value="conforme" checked={inspectionData.housekeeping.status === 'conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.housekeeping.comment} />
                    <CheckboxItem label="" name="housekeeping" value="non-conforme" checked={inspectionData.housekeeping.status === 'non-conforme'} onChange={handleStatusChange} onCommentChange={handleCommentChange} comment={inspectionData.housekeeping.comment} />
                </dl>
            </FormSection>
            
             <div className="flex justify-end gap-4 pt-6">
                 <button type="button" onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all mr-auto">
                    Télécharger (CSV)
                </button>
                <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all">
                    Soumettre l'Inspection
                </button>
            </div>
        </form>
    );
};

export default SiteInspectionForm;
