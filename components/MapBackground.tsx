
import React from 'react';

const MapBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 bg-cover bg-center opacity-20"
      style={{ backgroundImage: "url('https://picsum.photos/seed/geology/2000/1500')" }}
    >
      <div className="absolute inset-0 bg-gray-900/50"></div>
    </div>
  );
};

export default MapBackground;
