import React from 'react';
import { User } from '../types';
import { DownloadIcon } from './icons';
import { downloadData } from '../utils/download';

// Données fictives des utilisateurs pour la démonstration
const mockUsers: User[] = [
  { nom: 'Diouf', prenom: 'Serigne Saliou', email: 'serignesalioudiouf71@gmail.com', telephone: '+221771234567', statut: 'Admin' },
  { nom: 'Doe', prenom: 'John', email: 'john.doe@geosmart.com', telephone: '+15551234567', statut: 'Payé' },
  { nom: 'Keita', prenom: 'Awa', email: 'awa.keita@example.com', telephone: '+22370987654', statut: 'Payé' },
  { nom: 'Traoré', prenom: 'Moussa', email: 'm.traore@request.com', telephone: '+22507112233', statut: 'En attente' },
  { nom: 'Smith', prenom: 'Jane', email: 'jane.smith@geocorp.net', telephone: '+442012345678', statut: 'Payé' },
  { nom: 'Ndiaye', prenom: 'Fatou', email: 'f.ndiaye@request.com', telephone: '+221769876543', statut: 'En attente' },
];

const AdminPage: React.FC = () => {

  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    const formattedData = mockUsers.map(user => ({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        statut_abonnement: user.statut,
    }));
    downloadData(formattedData, `journal_utilisateurs_${timestamp}.csv`);
  };

  const getStatusBadge = (status: User['statut']) => {
    switch (status) {
        case 'Admin':
            return 'bg-amber-500/20 text-amber-300';
        case 'Payé':
            return 'bg-green-500/20 text-green-300';
        case 'En attente':
            return 'bg-yellow-500/20 text-yellow-300';
        default:
            return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-amber-400">Administration des Utilisateurs</h2>
                    <p className="text-gray-400 mt-1">Consultez et gérez les utilisateurs de l'application.</p>
                </div>
                <button 
                    onClick={handleDownload} 
                    className="bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-all duration-200 flex items-center justify-center whitespace-nowrap"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Télécharger le journal (CSV)
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom Complet</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Téléphone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800/50 divide-y divide-gray-700/50">
                        {mockUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.prenom} {user.nom}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.telephone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.statut)}`}>
                                        {user.statut}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AdminPage;