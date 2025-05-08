import { Hub } from "aws-amplify/utils";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

/*
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [localRedirectSignIn, productionRedirectSignIn] =
  awsmobile.oauth.redirectSignIn.split(",");

const [localRedirectSignOut, productionRedirectSignOut] =
  awsmobile.oauth.redirectSignOut.split(",");

export const updatedawsmobile = {
  ...awsmobile,
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
};*/

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
  Hub.listen("auth", ({ payload: { event, data } }) => {
    switch (event) {
      case "signInWithRedirect":
      case "signIn":
      case "cognitoHostedUI":
        getUser().then((userData) => setUser(userData));
        break;
      case "signOut":
        setUser(null);
        break;
      case "signIn_failure":
      case "signInWithRedirect_failure":
      case "cognitoHostedUI_failure":
        console.log("Sign in failure", data);
        break;
      default:
    }
  });

  getUser().then((userData) => setUser(userData));
}
