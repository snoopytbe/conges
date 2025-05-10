import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

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



  getUser().then((userData) => setUser(userData));
}