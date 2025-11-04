import React, { useState } from 'react';

interface AuthPageProps {
  onAuthSuccess: (email: string) => void;
}

const ADMIN_EMAIL = 'serignesalioudiouf71@gmail.com';

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailInput = (e.currentTarget.elements.namedItem(isLoginView ? 'email-login' : 'email-signup') as HTMLInputElement);
    
    if (!emailInput || !emailInput.value.trim()) {
      setError("Le champ de l'adresse e-mail ne peut pas être vide.");
      return;
    }
    
    const email = emailInput.value.trim().toLowerCase();

    if (isLoginView) {
      // --- LOGIQUE DE CONNEXION ---
      if (email === ADMIN_EMAIL) {
        // L'administrateur se connecte gratuitement
        onAuthSuccess(email);
      } else {
        // Les autres utilisateurs ont besoin d'une autorisation/paiement
        setError("Ce compte n'a pas d'abonnement actif ou n'est pas autorisé. Veuillez contacter l'administrateur.");
      }
    } else {
      // --- LOGIQUE D'INSCRIPTION (DEMANDE D'ACCÈS) ---
      if (email === ADMIN_EMAIL) {
        setError("Un compte administrateur avec cet e-mail existe déjà. Veuillez vous connecter.");
        return;
      }

      // Pour les autres utilisateurs, simuler l'envoi d'une demande d'autorisation
      setSuccessMessage("Votre demande d'inscription a été envoyée. L'administrateur doit approuver votre compte avant que vous puissiez vous connecter.");
      (e.target as HTMLFormElement).reset(); // Vider les champs du formulaire
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setSuccessMessage(null);
  };

  const inputClasses = "mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500";

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-gray-700/50">
        {isLoginView ? (
          // Formulaire de Connexion
          <div>
            <h2 className="text-3xl font-bold text-center text-amber-400 mb-8">Connexion</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email-login" className="block text-sm font-medium text-gray-300">Adresse mail</label>
                <input type="email" id="email-login" name="email-login" required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-300">Mot de passe</label>
                <input type="password" id="password-login" name="password-login" required className={inputClasses} />
              </div>
              <button type="submit" className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-400 transition-all duration-300">
                Se connecter
              </button>
            </form>
            {error && (
              <p className="mt-4 text-center text-sm text-red-400">{error}</p>
            )}
            <p className="mt-6 text-center text-sm text-gray-400">
              Pas encore de compte ?{' '}
              <button onClick={toggleView} className="font-medium text-amber-400 hover:text-amber-300">
                Demander un accès
              </button>
            </p>
          </div>
        ) : (
          // Formulaire d'Inscription / Demande d'accès
          <div>
            <h2 className="text-3xl font-bold text-center text-amber-400 mb-8">
              {successMessage ? "Demande Envoyée" : "Demande d'accès"}
            </h2>

            {successMessage ? (
              <div className="text-center space-y-4">
                <p className="text-green-400">{successMessage}</p>
                <button onClick={toggleView} className="font-medium text-amber-400 hover:text-amber-300 underline">
                  Retour à la page de connexion
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-300">Nom</label>
                      <input type="text" id="nom" required className={inputClasses} />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-300">Prénom</label>
                      <input type="text" id="prenom" required className={inputClasses} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email-signup" className="block text-sm font-medium text-gray-300">Adresse mail</label>
                    <input type="email" id="email-signup" name="email-signup" required className={inputClasses} />
                  </div>
                   <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-300">Téléphone</label>
                    <input type="tel" id="telephone" required className={inputClasses} />
                  </div>
                  <div>
                    <label htmlFor="password-signup" className="block text-sm font-medium text-gray-300">Mot de passe</label>
                    <input type="password" id="password-signup" name="password-signup" required className={inputClasses} />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-400 transition-all duration-300 mt-6">
                    Envoyer la demande
                  </button>
                </form>
                {error && (
                  <p className="mt-4 text-center text-sm text-red-400">{error}</p>
                )}
                <p className="mt-6 text-center text-sm text-gray-400">
                  Déjà un compte ?{' '}
                  <button onClick={toggleView} className="font-medium text-amber-400 hover:text-amber-300">
                    Se connecter
                  </button>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;