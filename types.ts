
export interface IdentifiedMineral {
  name: string;
  percentage: number;
  description: string;
}

export interface MineralAnalysis {
  rockName: string;
  description: string;
  identifiedMinerals: IdentifiedMineral[];
  economicPotential: string;
}

export type User = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: 'Payé' | 'En attente' | 'Admin';
};

export type View = 'Dashboard' | 'Feuille de compilation' | 'Analyse IA' | 'Cartographie & SIG' | 'Base de Données' | 'Exploration' | 'HSE & Reporting' | 'User Profile' | 'Administration';