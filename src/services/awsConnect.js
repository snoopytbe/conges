import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { useState } from 'react';

function getUser() {
  return getCurrentUser()
    .then(async (userData) => {
      try {
        const attributes = await fetchUserAttributes();
        console.log('Attributs utilisateur:', attributes); // Pour le débogage
        return {
          ...userData,
          sub: attributes.sub,
          given_name: attributes.given_name,
          family_name: attributes.family_name,
          email: attributes.email,
          picture: attributes.picture,
          username: attributes.userId
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des attributs:", error);
        return userData;
      }
    })
    .catch(() => console.log("Not signed in"));
}

export function awsConnect(setUser) {
  // TODO: Implement sign in and sign out

  getUser().then((userData) => setUser(userData));
}

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

  const signOutUser = async () => {
    try {
      // TODO: Implement sign out
    } catch (err) {
      setError({
        type: ERROR_TYPES.AUTHENTICATION,
        message: "Erreur lors de la déconnexion. Veuillez réessayer.",
        originalError: err
      });
      console.error("Erreur de déconnexion:", err);
    } finally {
      setIsLoading(false);
    }
  };



  return {
    user,
    isLoading,
    error,
    connectUser,
    signOutUser
  };
}; 