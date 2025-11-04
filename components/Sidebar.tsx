
import React from 'react';
import { MapIcon, DatabaseIcon, DrillIcon, SafetyIcon, DashboardIcon, AiIcon, UsersIcon, ClipboardListIcon } from './icons';
import { View } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeView: View;
  setActiveView: (view: View) => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, setActiveView, isAdmin }) => {
  const navItems: { icon: React.FC<{className?: string}>, name: View }[] = [
    { icon: DashboardIcon, name: 'Dashboard' },
    { icon: ClipboardListIcon, name: 'Feuille de compilation' },
    { icon: MapIcon, name: 'Cartographie & SIG' },
    { icon: DatabaseIcon, name: 'Base de Données' },
    { icon: DrillIcon, name: 'Exploration' },
    { icon: AiIcon, name: 'Analyse IA' },
    { icon: SafetyIcon, name: 'HSE & Reporting' },
  ];

  if (isAdmin) {
    navItems.push({ icon: UsersIcon, name: 'Administration' });
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, view: View) => {
    e.preventDefault();
    setActiveView(view);
  };

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900/80 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-700/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-700/50 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white tracking-wider">
            Geo<span className="text-amber-400">Field</span>Pro
          </h2>
        </div>
        <nav className="flex-grow px-4 py-6 overflow-y-auto">
          <ul className="space-y-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, item.name)}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    item.name === activeView
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="ml-4 font-medium">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <p className="text-xs text-center text-gray-500">
            GeoSmart Field © 2024
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;