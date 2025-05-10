import awsExports from '../amplifyconfiguration.json';
const CLIENT_ID = awsExports.aws_user_pools_web_client_id;

import {
  getCurrentUser,
  fetchUserAttributes,
  signInWithRedirect,
  fetchAuthSession,
  signOut,
} from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export const ERROR_TYPES = {
  CONNECTION: 'CONNECTION',
  AUTHENTICATION: 'AUTHENTICATION',
  UNKNOWN: 'UNKNOWN',
};

async function getUserInfo() {
  const userData = await getCurrentUser();
  const attributes = await fetchUserAttributes();
  return {
    ...userData,
    sub:          attributes.sub,
    given_name:   attributes.given_name,
    family_name:  attributes.family_name,
    email:        attributes.email,
    picture:      attributes.picture,
    username:     attributes.userId || userData.username,
  };
}

export async function awsConnect() {
  await signInWithRedirect({ provider: 'Google' });
  // redirection immédiate vers Cognito Hosted UI
}

export const useAuth = () => {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const signOutUser = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);

      // logout complet chez Cognito
      /*const domain     = `https://${awsExports.oauth.domain}`;
      const redirectTo = encodeURIComponent(window.location.origin);
      window.location.href = 
        `${domain}/logout?client_id=${CLIENT_ID}&logout_uri=${redirectTo}`;*/
    } catch (err) {
      setError({
        type: ERROR_TYPES.AUTHENTICATION,
        message: "Erreur lors de la déconnexion.",
        originalError: err,
      });
      console.error('Erreur de déconnexion :', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1) Détection de l’état : callback OAuth ou LastAuthUser en storage
      const isCallback = window.location.search.includes('code=') 
                      && window.location.search.includes('state=');
      const storageKey = `CognitoIdentityServiceProvider.${CLIENT_ID}.LastAuthUser`;
      const hadUser    = !!localStorage.getItem(storageKey);

      if (isCallback || hadUser) {
        try {
          // si on revient d’un login OAuth
          if (isCallback) {
            await fetchAuthSession();
            // tu peux nettoyer l’URL ici si tu veux : window.history.replaceState(...)
          }
          // lecture des infos utilisateur
          const info = await getUserInfo();

          // si on avait déjà un user, on peut aussi récupérer les credentials IAM
          if (!isCallback) {
            try { await fetchAuthSession(); }
            catch (e) { console.warn('IAM creds non récupérées :', e); }
          }

          setUser(info);
        } catch (err) {
          console.error('Erreur d’init auth :', err);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  return {
    user,
    isLoading,
    error,
    connectUser: awsConnect,
    signOutUser,
  };
};
