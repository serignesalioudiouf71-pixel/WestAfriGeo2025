import React from 'react';
import { UserIcon, EditIcon } from './icons';

const UserProfilePage: React.FC = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@geosmart.com',
    role: 'Ingénieur Géologue Principal',
    team: 'Exploration Ouest',
    avatar: 'https://picsum.photos/seed/geologist/200/200',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative flex-shrink-0">
            <img
              className="w-32 h-32 rounded-full border-4 border-amber-500"
              src={user.avatar}
              alt="User Avatar"
            />
            <button className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full hover:bg-amber-500 transition-colors" aria-label="Edit avatar">
              <EditIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
            <p className="text-amber-400 mt-1">{user.role}</p>
            <p className="text-gray-400 text-sm mt-4">{user.email}</p>
            <p className="text-gray-400 text-sm">Équipe : {user.team}</p>

            <button className="mt-6 bg-amber-500 text-gray-900 font-bold py-2 px-5 rounded-lg hover:bg-amber-400 transition-all duration-300">
              Modifier le Profil
            </button>
          </div>
        </div>
        
        <div className="mt-10 border-t border-gray-700/50 pt-8">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Informations Complémentaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-400">Date d'inscription</p>
                    <p className="text-white">15 Janvier 2023</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-400">Dernière activité</p>
                    <p className="text-white">Aujourd'hui à 14:30</p>
                </div>
                 <div className="bg-gray-900/50 p-4 rounded-lg md:col-span-2">
                    <p className="font-semibold text-gray-400">Permissions</p>
                    <p className="text-white">Admin, Saisie de données, Analyse IA, Reporting HSE</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;
