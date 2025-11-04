import React, { useState } from 'react';
import { LocationMarkerIcon, DownloadIcon, MyLocationIcon, MapIcon } from './icons';
import { downloadData } from '../utils/download';

// Form Section Wrapper
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
      <LocationMarkerIcon className="w-5 h-5 mr-2" />
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

// Generic Input Field
const InputField: React.FC<{ label: string; id: string; type?: string; placeholder?: string; value: string; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; className?: string; }> = ({ label, id, type = "text", placeholder, value, name, onChange, className }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
    />
  </div>
);

// Input Field with a Unit Selector
const InputWithUnit: React.FC<{ label: string; id: string; type?: string; placeholder?: string; value: string; name: string; unitValue: string; unitName: string; options: string[]; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; }> = ({ label, id, type = "text", placeholder, value, name, unitValue, unitName, options, onChange }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full flex-1 rounded-none rounded-l-md bg-gray-900/50 border border-gray-600 py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        />
        <select
          name={unitName}
          value={unitValue}
          onChange={onChange}
          className="inline-flex items-center rounded-r-md border border-l-0 border-gray-600 bg-gray-700 px-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
);

const initialFormData = {
    latitude: '',
    longitude: '',
    altitude: '',
    latLonUnit: 'DD',
    altUnit: 'mètres',
    pays: '',
    region: '',
    commune: '',
    ville: '',
    zoneEtude: '',
    prospect: '',
    point: ''
};

const mockSubmittedData = [
    { ...initialFormData, latitude: '5.361', longitude: '-4.009', altitude: '152', pays: `Cote d'Ivoire`, region: 'Lagunes', commune: 'Port-Bouet', ville: 'Abidjan', zoneEtude: 'Projet aurifere ABC', prospect: 'Zone Anomale 1', point: 'PT-001'},
    { ...initialFormData, latitude: '5.362', longitude: '-4.010', altitude: '155', pays: `Cote d'Ivoire`, region: 'Lagunes', commune: 'Port-Bouet', ville: 'Abidjan', zoneEtude: 'Projet aurifere ABC', prospect: 'Zone Anomale 1', point: 'PT-002'},
    { ...initialFormData, latitude: '5.363', longitude: '-4.011', altitude: '158', pays: `Cote d'Ivoire`, region: 'Lagunes', commune: 'Port-Bouet', ville: 'Abidjan', zoneEtude: 'Projet aurifere ABC', prospect: 'Zone Anomale 1', point: 'PT-003'},
];

const MappingPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success'>('idle');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Default map view: West Africa
  const [mapUrl, setMapUrl] = useState('https://www.openstreetmap.org/export/embed.html?bbox=-18.0,4.0,5.0,15.0&layer=mapnik');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSubmissionStatus('idle');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données enregistrées:', formData);
    setSubmissionStatus('success');
    setFormData(initialFormData); // Reset form for next entry

    setTimeout(() => {
        setSubmissionStatus('idle');
    }, 3000);
  };

  const handleDownload = () => {
    downloadData(mockSubmittedData, 'mapping_points.csv');
  }

  const handleViewOnMap = (latParam?: number, lonParam?: number) => {
      const lat = latParam ?? parseFloat(formData.latitude);
      const lon = lonParam ?? parseFloat(formData.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
          setGeoError(null);
          const bboxSize = 0.01; // ~1km view
          const newUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - bboxSize},${lat - bboxSize},${lon + bboxSize},${lat + bboxSize}&layer=mapnik&marker=${lat},${lon}`;
          setMapUrl(newUrl);
      } else {
          setGeoError("Veuillez entrer une latitude et une longitude valides.");
      }
  };

  const handleGetLocation = () => {
      if (navigator.geolocation) {
          setGeoError(null);
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setFormData(prev => ({
                      ...prev,
                      latitude: position.coords.latitude.toFixed(6),
                      longitude: position.coords.longitude.toFixed(6),
                      altitude: position.coords.altitude ? position.coords.altitude.toFixed(2) : '',
                  }));
                  handleViewOnMap(position.coords.latitude, position.coords.longitude);
              },
              (err) => {
                  setGeoError(`Erreur de géolocalisation: ${err.message}`);
              }
          );
      } else {
          setGeoError("La géolocalisation n'est pas supportée par ce navigateur.");
      }
  };


  return (
    <div className="p-6 max-w-full mx-auto">
      <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Map Viewer */}
        <div className="flex flex-col h-[60vh] lg:h-auto">
            <h2 className="text-2xl font-bold text-amber-400 mb-4 flex-shrink-0">Visualiseur de Carte</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-700 flex-grow min-h-0">
                <iframe
                    key={mapUrl}
                    width="100%"
                    height="100%"
                    className="rounded-md"
                    src={mapUrl}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>

        {/* Right Side: Data Entry Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-amber-400">Saisie de Données de Terrain</h2>
            
            <FormSection title="Coordonnées Géographiques">
                <InputWithUnit
                    label="Latitude" id="latitude" name="latitude" type="number" placeholder="ex: 5.360"
                    value={formData.latitude} unitValue={formData.latLonUnit} unitName="latLonUnit"
                    options={['DD', 'DMS']} onChange={handleChange}
                />
                <InputWithUnit
                    label="Longitude" id="longitude" name="longitude" type="number" placeholder="ex: -4.008"
                    value={formData.longitude} unitValue={formData.latLonUnit} unitName="latLonUnit"
                    options={['DD', 'DMS']} onChange={handleChange}
                />
                <InputWithUnit
                    label="Altitude" id="altitude" name="altitude" type="number" placeholder="ex: 150"
                    value={formData.altitude} unitValue={formData.altUnit} unitName="altUnit"
                    options={['mètres', 'pieds']} onChange={handleChange}
                />
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
                    <button type="button" onClick={handleGetLocation} className="flex-1 flex items-center justify-center gap-2 text-sm bg-blue-600/80 text-white hover:bg-blue-500/80 font-semibold py-2 px-4 rounded-lg transition-colors">
                        <MyLocationIcon className="w-5 h-5" />
                        Obtenir ma position
                    </button>
                    <button type="button" onClick={() => handleViewOnMap()} className="flex-1 flex items-center justify-center gap-2 text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <MapIcon className="w-5 h-5" />
                        Voir sur la carte
                    </button>
                </div>
                {geoError && <p className="md:col-span-2 text-sm text-red-400 mt-2">{geoError}</p>}
            </FormSection>

            <FormSection title="Localisation Administrative">
                <InputField label="Pays" id="pays" name="pays" placeholder="ex: Côte d'Ivoire" value={formData.pays} onChange={handleChange} />
                <InputField label="Région" id="region" name="region" placeholder="ex: Lagunes" value={formData.region} onChange={handleChange} />
                <InputField label="Commune" id="commune" name="commune" placeholder="ex: Port-Bouët" value={formData.commune} onChange={handleChange} />
                <InputField label="Ville" id="ville" name="ville" placeholder="ex: Abidjan" value={formData.ville} onChange={handleChange} />
            </FormSection>

            <FormSection title="Informations Projet">
                <InputField label="Zone d'études" id="zoneEtude" name="zoneEtude" placeholder="ex: Projet aurifère ABC" value={formData.zoneEtude} onChange={handleChange} className="md:col-span-2" />
                <InputField label="Prospect" id="prospect" name="prospect" placeholder="ex: Zone Anomale 1" value={formData.prospect} onChange={handleChange} />
                <InputField label="Nom du Point" id="point" name="point" placeholder="ex: PT-001" value={formData.point} onChange={handleChange} />
            </FormSection>
            
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-2">
                {submissionStatus === 'success' && (
                    <p className="text-green-400 text-sm animate-fade-in order-1 sm:order-none sm:mr-auto">
                        Point enregistré avec succès !
                    </p>
                )}
                 <button type="button" onClick={handleDownload} className="w-full sm:w-auto bg-gray-600 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all duration-300 flex items-center justify-center gap-2">
                    <DownloadIcon className="w-5 h-5" /> Télécharger
                </button>
                <button type="button" onClick={handleReset} className="w-full sm:w-auto bg-gray-700/80 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-all">
                    Réinitialiser
                </button>
                <button type="submit" className="w-full sm:w-auto bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-all duration-300">
                    Enregistrer le Point
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MappingPage;