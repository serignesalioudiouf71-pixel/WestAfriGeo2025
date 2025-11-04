
import React, { useState, useMemo } from 'react';
import { DownloadIcon, EyeIcon, EditIcon, TrashIcon } from './icons';
import { downloadData } from '../utils/download';

type DataPoint = {
  id: string;
  type: 'Cartographie' | 'Géochimie' | 'Sondage RC' | 'Tranchée' | 'Affleurement';
  date: string;
  coordX: number;
  coordY: number;
  coordZ: number;
  projet: string;
  description: string;
};

// Mock data combining different sources
const mockCompilationData: DataPoint[] = [
  { id: 'PT-001', type: 'Cartographie', date: '2024-07-10', coordX: 5.361, coordY: -4.009, coordZ: 152, projet: 'Projet Aurifère ABC', description: 'Point de localisation initial.' },
  { id: 'PT-002', type: 'Cartographie', date: '2024-07-10', coordX: 5.362, coordY: -4.010, coordZ: 155, projet: 'Projet Aurifère ABC', description: 'Route d\'accès.' },
  { id: 'GEO-056', type: 'Géochimie', date: '2024-07-11', coordX: 5.368, coordY: -4.015, coordZ: 160, projet: 'Projet Aurifère ABC', description: 'Échantillon de sol.' },
  { id: 'RC-001-01', type: 'Sondage RC', date: '2024-07-12', coordX: 5.400, coordY: -4.050, coordZ: 170, projet: 'Projet Cuivre-Or XYZ', description: 'Collar du trou RC-001.' },
  { id: 'TR-01-S01', type: 'Tranchée', date: '2024-07-13', coordX: 5.375, coordY: -4.020, coordZ: 158, projet: 'Projet Aurifère ABC', description: 'Log de tranchée, échantillon 1.' },
  { id: 'TR-01-S02', type: 'Tranchée', date: '2024-07-13', coordX: 5.375, coordY: -4.020, coordZ: 158, projet: 'Projet Aurifère ABC', description: 'Log de tranchée, échantillon 2.' },
  { id: 'AFF-012', type: 'Affleurement', date: '2024-07-14', coordX: 5.410, coordY: -4.061, coordZ: 182, projet: 'Projet Cuivre-Or XYZ', description: 'Affleurement de métavolcanite.' },
  { id: 'GEO-057', type: 'Géochimie', date: '2024-07-11', coordX: 5.369, coordY: -4.016, coordZ: 161, projet: 'Projet Aurifère ABC', description: 'Échantillon de termitière.' },
];

// Generate more data for pagination demonstration
for(let i = 8; i < 50; i++) {
    mockCompilationData.push({
        id: `PT-${String(i+1).padStart(3, '0')}`,
        type: 'Cartographie',
        date: `2024-07-${15 + (i % 5)}`,
        coordX: 5.361 + i/1000,
        coordY: -4.009 + i/1000,
        coordZ: 152 + i,
        projet: i % 3 === 0 ? 'Projet Cuivre-Or XYZ' : 'Projet Aurifère ABC',
        description: `Point de routine ${i+1}`
    });
}


const CompilationSheetPage: React.FC = () => {
    const [filters, setFilters] = useState({ id: '', type: '', projet: '' });
    const [sortConfig, setSortConfig] = useState<{ key: keyof DataPoint | null; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredData = useMemo(() => {
        return mockCompilationData.filter(item =>
            item.id.toLowerCase().includes(filters.id.toLowerCase()) &&
            (filters.type === '' || item.type === filters.type) &&
            item.projet.toLowerCase().includes(filters.projet.toLowerCase())
        );
    }, [filters]);

    const sortedData = useMemo(() => {
        let sortableData = [...filteredData];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [filteredData, sortConfig]);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage]);
    
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };
    
    const requestSort = (key: keyof DataPoint) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDownload = () => {
        downloadData(sortedData, 'feuille_de_compilation.csv');
    };

  const getSortIndicator = (key: keyof DataPoint) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="p-6 max-w-full mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="p-6">
                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400">Feuille de Compilation</h2>
                        <p className="text-gray-400 mt-1">Vue consolidée de tous les points de données enregistrés.</p>
                    </div>
                    <button onClick={handleDownload} className="bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-all duration-200 flex items-center justify-center whitespace-nowrap">
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Télécharger (CSV)
                    </button>
                </div>
                
                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg">
                    <input type="text" name="id" placeholder="Filtrer par ID Point..." value={filters.id} onChange={handleFilterChange} className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500" />
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500">
                        <option value="">Tous les Types</option>
                        <option value="Cartographie">Cartographie</option>
                        <option value="Géochimie">Géochimie</option>
                        <option value="Sondage RC">Sondage RC</option>
                        <option value="Tranchée">Tranchée</option>
                        <option value="Affleurement">Affleurement</option>
                    </select>
                    <input type="text" name="projet" placeholder="Filtrer par Projet..." value={filters.projet} onChange={handleFilterChange} className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('id')}>ID Point {getSortIndicator('id')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('type')}>Type {getSortIndicator('type')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('date')}>Date {getSortIndicator('date')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('coordX')}>Coord X / UTM E {getSortIndicator('coordX')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('coordY')}>Coord Y / UTM N {getSortIndicator('coordY')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('coordZ')}>Coord Z / Alt {getSortIndicator('coordZ')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Projet</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800/50 divide-y divide-gray-700/50">
                            {paginatedData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-amber-300">{item.id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{item.type}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{item.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">{item.coordX.toFixed(3)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">{item.coordY.toFixed(3)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">{item.coordZ}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{item.projet}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 space-x-2">
                                        <button className="p-1 hover:text-white" title="Voir les détails" onClick={() => alert(`Voir les détails pour ${item.id}`)}><EyeIcon className="w-5 h-5"/></button>
                                        <button className="p-1 hover:text-amber-400" title="Modifier" onClick={() => alert(`Modifier ${item.id}`)}><EditIcon className="w-5 h-5"/></button>
                                        <button className="p-1 hover:text-red-400" title="Supprimer" onClick={() => alert(`Supprimer ${item.id}`)}><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 px-4 py-2">
                    <span className="text-sm text-gray-400">
                        Page {currentPage} sur {totalPages} ({sortedData.length} résultats)
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            Précédent
                        </button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            Suivant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CompilationSheetPage;
