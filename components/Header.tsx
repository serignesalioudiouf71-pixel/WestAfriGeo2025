
import React, { useState, useEffect, useRef } from 'react';
import { MenuIcon, UserIcon, SettingsIcon, LogoutIcon } from './icons';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogout, onProfileClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 bg-gray-900/50 backdrop-blur-sm h-16 flex items-center justify-between px-6 z-40 border-b border-gray-700/50">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="text-gray-400 hover:text-white lg:hidden mr-4"
          aria-label="Open sidebar"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-amber-400">GeoSmart Field</h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-gray-700/50 transition-colors"
        >
          <span className="text-sm text-gray-400 hidden sm:block">Ing. Géologue</span>
          <img
            className="w-10 h-10 rounded-full border-2 border-amber-500"
            src="https://picsum.photos/seed/geologist/100/100"
            alt="User Avatar"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700/50 animate-fade-in-down">
            <div className="px-4 py-3 border-b border-gray-700/50">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-gray-400 truncate">john.doe@geosmart.com</p>
            </div>
            <button
              onClick={() => {
                onProfileClick();
                setIsDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Mon Profil
            </button>
            <a href="#" className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors">
              <SettingsIcon className="w-5 h-5 mr-3" />
              Paramètres
            </a>
            <div className="border-t border-gray-700/50 my-1"></div>
            <button
              onClick={onLogout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogoutIcon className="w-5 h-5 mr-3" />
              Se déconnecter
            </button>
          </div>
        )}
        {/* Fix: Removed non-standard "jsx" prop from style tag. This is not standard in React without a library like styled-jsx. */}
        <style>{`
          @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out;
          }
        `}</style>
      </div>
    </header>
  );
};

export default Header;