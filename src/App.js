import React from "react";
import "./style.css";
import Calendrier from "./Calendrier";
//import { updatedawsmobile, awsConnect } from "./awsConnect";
//import { Amplify } from "aws-amplify";

//Amplify.configure(updatedawsmobile);

export default function App() {
  //const [user, setUser] = React.useState(null);

  /*React.useEffect(() => {
    // Connexion AWS de l'utilisateur
    awsConnect(setUser);
  }, []);*/

  return (
    <>
      <div>
        <Calendrier />
      </div>
    </>
  );
}
