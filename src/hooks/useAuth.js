import { useState, useEffect } from 'react';
import { awsConnect } from '../services';

export const ERROR_TYPES = {
  CONNECTION: 'CONNECTION',
  AUTHENTICATION: 'AUTHENTICATION',
  UNKNOWN: 'UNKNOWN'
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const connectUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await awsConnect(setUser);
    } catch (err) {
      let errorType = ERROR_TYPES.UNKNOWN;
      let errorMessage = "Une erreur est survenue lors de la connexion";

      if (err.name === 'NetworkError') {
        errorType = ERROR_TYPES.CONNECTION;
        errorMessage = "Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.";
      } else if (err.name === 'AuthError') {
        errorType = ERROR_TYPES.AUTHENTICATION;
        errorMessage = "Erreur d'authentification. Veuillez réessayer de vous connecter.";
      }

      setError({
        type: errorType,
        message: errorMessage,
        originalError: err
      });
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    connectUser
  };
}; 