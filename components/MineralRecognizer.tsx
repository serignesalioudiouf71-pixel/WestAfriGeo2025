import React, { useState, useCallback } from 'react';
import { analyzeMineralSample } from '../services/geminiService';
import { MineralAnalysis } from '../types';
import { UploadIcon, DownloadIcon } from './icons';
import { downloadData } from '../utils/download';

const MineralRecognizer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MineralAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAnalysis(null);
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImageBase64(base64String);
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageBase64 || !imageFile) {
      setError("Please select an image file first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeMineralSample(imageBase64, imageFile.type);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64, imageFile]);

  const handleDownload = () => {
    if (!analysis) return;
    const dataToDownload = analysis.identifiedMinerals.map(mineral => ({
        rock_name: analysis.rockName,
        rock_description: analysis.description,
        economic_potential: analysis.economicPotential,
        mineral_name: mineral.name,
        mineral_percentage: mineral.percentage,
        mineral_description: mineral.description,
    }));
    downloadData(dataToDownload, 'mineral_analysis.csv');
  };

  const ResultCard: React.FC<{ title: string; children: React.ReactNode; onDownload?: () => void }> = ({ title, children, onDownload }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-amber-400">{title}</h3>
            {onDownload && (
                <button onClick={onDownload} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50">
                    <DownloadIcon className="w-5 h-5" />
                    <span className="sr-only">Télécharger les résultats</span>
                </button>
            )}
        </div>
      <div className="text-gray-300 text-sm space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Upload and Preview */}
        <div className="flex flex-col space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                {previewUrl ? (
                  <img src={previewUrl} alt="Sample Preview" className="mx-auto max-h-64 rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <UploadIcon className="w-12 h-12 mb-2" />
                    <p className="font-semibold">Cliquez pour téléverser une image</p>
                    <p className="text-xs">PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
            </label>
            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          {imageFile && (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">Fichier: {imageFile.name}</p>
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-400 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyse en cours...
                  </>
                ) : (
                  "Analyser l'échantillon"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Results */}
        <div className="flex flex-col space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center h-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <p className="text-amber-300">L'IA géologue analyse votre échantillon...</p>
            </div>
          )}
          {error && (
             <div className="bg-red-500/20 text-red-300 p-4 rounded-lg border border-red-500/50">
                <h4 className="font-bold">Erreur d'analyse</h4>
                <p className="text-sm">{error}</p>
            </div>
          )}
          {analysis && (
            <div className="space-y-4" onDoubleClick={handleDownload}>
              <ResultCard title="Identification de la Roche" onDownload={handleDownload}>
                <h4 className="text-2xl font-bold text-white">{analysis.rockName}</h4>
                <p>{analysis.description}</p>
              </ResultCard>

              <ResultCard title="Minéraux Identifiés">
                <ul className="space-y-3">
                  {analysis.identifiedMinerals.map((mineral, index) => (
                    <li key={index} className="border-b border-gray-700/50 pb-2 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{mineral.name}</span>
                        <span className="text-amber-300 font-mono bg-gray-700/50 px-2 py-1 rounded-md text-xs">{mineral.percentage}%</span>
                      </div>
                      <p className="text-xs text-gray-400">{mineral.description}</p>
                    </li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard title="Potentiel Économique">
                <p>{analysis.economicPotential}</p>
              </ResultCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MineralRecognizer;