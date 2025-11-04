import React, { useState, useCallback } from 'react';
import { generateDashboardSummary } from '../services/geminiService';
import { MineralAnalysis } from '../types';
import { AiIcon, DownloadIcon } from './icons';
import { downloadText } from '../utils/download';


// Mock data for recent analyses
const mockAnalyses: MineralAnalysis[] = [
  {
    rockName: "Granite Pegmatite",
    description: "Coarse-grained intrusive igneous rock with large crystals.",
    identifiedMinerals: [
      { name: "Quartz", percentage: 35, description: "Smoky variety, anhedral." },
      { name: "Feldspar (Orthoclase)", percentage: 45, description: "Pinkish, large crystals." },
      { name: "Mica (Biotite)", percentage: 15, description: "Black, flaky sheets." },
      { name: "Tourmaline", percentage: 5, description: "Black, prismatic crystals." }
    ],
    economicPotential: "Potential source of feldspar for ceramics and possibly rare earth elements associated with pegmatites."
  },
  {
    rockName: "Birimian Metavolcanic",
    description: "Fine-grained, greenish rock showing signs of low-grade metamorphism.",
    identifiedMinerals: [
      { name: "Chlorite", percentage: 40, description: "Green, gives the rock its color." },
      { name: "Actinolite", percentage: 30, description: "Needle-like green crystals." },
      { name: "Plagioclase", percentage: 20, description: "Altered, small laths." },
      { name: "Pyrite", percentage: 10, description: "Disseminated fine grains, golden color." }
    ],
    economicPotential: "High potential for gold mineralization, as pyrite is often a pathfinder mineral in Birimian greenstone belts."
  },
  {
    rockName: "Quartz-Vein Breccia",
    description: "Angular fragments of host rock cemented by milky quartz.",
    identifiedMinerals: [
      { name: "Quartz", percentage: 85, description: "Massive, vein-filling." },
      { name: "Hematite (after Pyrite)", percentage: 10, description: "Reddish-brown staining, boxwork textures." },
      { name: "Sericite", percentage: 5, description: "Fine-grained mica, alteration product." }
    ],
    economicPotential: "Very high potential for orogenic gold deposits. The presence of quartz veins with sulfide boxworks is a classic exploration target in West Africa."
  }
];

// A simple component to render markdown-like text
const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const elements = content.split('\n').map((line, index) => {
    line = line.trim();
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-bold text-amber-400 mt-4 mb-2">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold text-white mt-4 mb-2">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-bold text-white mt-4 mb-2">{line.substring(2)}</h1>;
    }
    if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
    }
    if (line === '') {
        return null; // Don't render empty lines as paragraphs
    }
    return <p key={index} className="mb-2">{line}</p>;
  });

  return <div className="text-gray-300 text-sm space-y-2">{elements}</div>;
};


const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await generateDashboardSummary(mockAnalyses);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = () => {
    if (!summary) return;
    downloadText(summary, 'dashboard_summary.txt');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h2 className="text-2xl font-bold text-amber-400">Tableau de Bord IA</h2>
                <p className="text-gray-400 mt-1">Synthèse des récentes découvertes géologiques.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {summary && !isLoading && (
                    <button onClick={handleDownload} className="bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-all duration-200 flex items-center justify-center whitespace-nowrap">
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Télécharger
                    </button>
                )}
                <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="bg-amber-500 w-full sm:w-auto text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Génération...
                      </>
                    ) : (
                        <>
                            <AiIcon className="w-5 h-5 mr-2" />
                            Générer la Synthèse IA
                        </>
                    )}
                </button>
            </div>
        </div>

        <div className="mt-6 border-t border-gray-700/50 pt-6 min-h-[200px] flex flex-col justify-center">
            {isLoading && (
                 <div className="flex items-center justify-center h-full text-center">
                    <p className="text-amber-300">L'IA géologue-consultant analyse les données...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-500/20 text-red-300 p-4 rounded-lg border border-red-500/50">
                    <h4 className="font-bold">Erreur de Génération de la Synthèse</h4>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {summary ? (
                <SimpleMarkdownRenderer content={summary} />
            ) : (
                !isLoading && !error && <p className="text-gray-500 text-center">Cliquez sur "Générer la Synthèse IA" pour obtenir un aperçu de vos récentes découvertes.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;